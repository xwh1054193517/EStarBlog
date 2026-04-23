import { Extension, extensions } from "@tiptap/core";
import { Plugin, PluginKey, TextSelection } from "@tiptap/pm/state";
import { Decoration, DecorationSet } from "@tiptap/pm/view";

interface AICompleteOptions {
  /**
   * 延迟时间，单位毫秒
   */
  debounceTime?: number;
  /**
   * 最小字符数
   */
  minChars?: number;
  /**
   * API地址
   */
  apiUrl?: string;
  /**
   * 上下文长度
   */
  contextLength?: number;
}

interface PluginState {
  /** 补全建议文本，null 表示没有建议 */
  suggestion: string | null;
  /** 补全建议显示的位置（文档中的字符偏移量），null 表示没有建议 */
  position: number | null;
}

// 外部创建插件键 ，用于在其他插件中获取插件状态
const pluginKey = new PluginKey<PluginState>("aiComplete");

export const AIComplete = Extension.create<AICompleteOptions>({
  name: "aiComplete",

  addOptions() {
    return {
      debounceTime: 500,
      // 最小字符数
      minChars: 5,
      // 上下文长度
      contextLength: 500,
      apiUrl: "/api/ai/complete"
    };
  },

  addProseMirrorPlugins() {
    // 保存 Extension 实例的引用（用于在闭包中访问）
    // 注意：在 apply 方法中，this 不是 Extension 实例，而是 StateField
    // 所以需要在闭包中保存 Extension 引用
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const extension = this;
    // 延迟时间
    let debounceTimer: NodeJS.Timeout | null = null;
    return [
      new Plugin({
        key: pluginKey,
        state: {
          /**
           * 初始化插件状态
           * 返回初始状态：没有补全建议
           */
          init(): PluginState {
            return {
              suggestion: null,
              position: null
            };
          },
          /**
           * 应用事务
           * 当事务包含 aiComplete 元数据时，更新插件状态
           * @param tr - ProseMirror 事务对象，包含状态变化信息
           * @param value - 当前插件状态
           * @param oldState - 旧的状态
           * @param newState - 新的状态
           * @returns 更新后的插件状态
           */
          apply(tr, value, oldState, newState) {
            // 用户按esc 取消补全 或 按Tab 接受补全建议 都要清楚
            if (tr.getMeta("ai-complete-reject") || tr.getMeta("ai-complete-accept")) {
              return {
                suggestion: null,
                position: null
              };
            }

            // api 返回数据了，要更新插件状态
            const aiRes = tr.getMeta("ai-complete-suggestion");
            if (aiRes) {
              return {
                suggestion: aiRes.suggestion,
                position: aiRes.position
              };
            }

            // 检查文本变化并且不是拒绝和接受补全，是否触发补全
            const isTextChange =
              tr.docChanged &&
              !tr.getMeta("ai-complete-reject") &&
              !tr.getMeta("ai-complete-accept");

            // 如果文本没变， 检查光标位置变没变
            if (!isTextChange) {
              const { selection } = newState;
              // 如果上次补全未应用，而当前光标位置跟上次补全位置不一致，即光标位置改变
              if (value.position !== selection.from && value.position !== null) {
                return {
                  suggestion: null,
                  position: null
                };
              }
              // 位置没变，也没补全 不动
              return value;
            }

            // 如果文本变了
            // 清除之前的防抖定时器（用户继续输入时，取消之前的请求）
            if (debounceTimer) {
              clearTimeout(debounceTimer);
              debounceTimer = null;
            }

            // 获取当前位置
            const { selection } = newState;
            const { from, to } = selection;

            // 如果用户选择了文本，不一定想要补全
            if (from !== to) {
              return {
                suggestion: null,
                position: null
              };
            }

            // 如果光标在代码块里 不补全
            const $from = newState.selection.$from;
            const isIncodeBlock =
              $from.node(-1)?.type.name === "codeBlock" || $from.parent.type.name === "codeBlock";
            if (isIncodeBlock) {
              return { suggestion: null, position: null };
            }

            // 提取前文500个字符，作为上下文，用于补全
            const ContextLength = extension.options.contextLength || 500;
            const textBeforeCursor = newState.doc.textBetween(
              Math.max(0, from - ContextLength),
              from
            );

            // 如果 太短
            const minChars = extension.options.minChars || 5;
            if (textBeforeCursor.trim().length < minChars) {
              return { suggestion: null, position: null };
            }

            // 记录通过校验后的光标位置，用于后续校验，防止异步竞态
            const currentFrom = from;
            // 防抖触发请求
            debounceTimer = setTimeout(async () => {
              // 触发补全请求
              try {
                // 再次读取编辑器状态
                const currentState = extension.editor.state;
                const currentSelection = currentState.selection;

                //再次校验光标位置 防止请求竞态
                if (currentSelection.from !== currentFrom) {
                  return;
                }

                // 获取上下文
                const fullText = currentState.doc.textContent;
                const apiUrl = extension.options.apiUrl || "/api/ai/complete";
                // const res = await fetch(apiUrl, {
                //   method: "POST",
                //   headers: { "Content-Type": "application/json" },
                //   body: JSON.stringify({
                //     content: fullText,
                //     cursorPosition: currentFrom
                //   })
                // });
                // const data = await res.json();
                const data = {
                  suggestion: "这是一个补全建议"
                };
                const suggestionText = data.suggestion;
                if (suggestionText && suggestionText.trim().length > 0) {
                  // 再次校验光标位置（双重检查，确保位置一致）
                  // 这是第二次校验，确保在 API 返回后位置仍然一致
                  const latestState = extension.editor.state;
                  if (latestState.selection.from === currentFrom) {
                    // 创建事务，更新插件状态
                    const tr = latestState.tr;
                    const pluginState = pluginKey.getState(latestState) as PluginState | undefined;
                    if (pluginState) {
                      // 通过事务元数据更新补全建议
                      // 这会在下一次 apply 调用时被处理
                      tr.setMeta("ai-complete-suggestion", {
                        suggestion: suggestionText,
                        position: currentFrom
                      });
                      // 触发事务应用
                      extension.editor.view.dispatch(tr);
                    }

                    return;
                  }
                }
              } catch (error) {
                console.error("触发补全请求失败", error);
              }
            }, extension.options.debounceTime || 500);

            return value;
          }
        },
        // 各种事件处理函数都可能返回true已处理该事件的指示
        props: {
          /**
           * 装饰渲染函数（decorations）
           *
           * 作用：在光标位置渲染补全建议的视觉提示
           *
           * 实现方式：
           * - 使用 Decoration.widget 创建不影响文档结构的装饰
           * - 装饰以灰色斜体文本的形式显示在光标位置
           * - 不拦截鼠标事件，不影响用户编辑
           *
           * @param state - 当前编辑器状态
           * @returns DecorationSet - 装饰集合，如果没有补全建议则返回空集合
           */
          decorations(state) {
            // 首先获取插件状态
            const pluginState = pluginKey.getState(state) as PluginState | undefined;
            console.log("pluginState", pluginState);
            if (!pluginState || !pluginState.suggestion || pluginState.position === null) {
              return DecorationSet.empty;
            }
            // 检查位置是否有效
            try {
              const resolved = state.doc.resolve(pluginState.position);
              if (!resolved) {
                return DecorationSet.empty;
              }
            } catch (error) {
              return DecorationSet.empty;
            }
            //检查当前位置和光标位置是否一致;
            const { selection } = state;
            if (selection.from !== pluginState.position) {
              return DecorationSet.empty;
            }

            // 创建装饰
            const widget = document.createElement("span");
            widget.className = "ai-completion-suggestion";
            // 样式设置：
            // - 灰色文字（#9ca3af），不抢夺注意力
            // - 斜体，区分于正常文本
            // - pointer-events: none，不拦截鼠标事件
            // - user-select: none，不可选中
            widget.style.cssText =
              "color: #9ca3af; " +
              "font-style: italic; " +
              "pointer-events: none; " +
              "user-select: none;";
            widget.textContent = pluginState.suggestion;
            return DecorationSet.create(state.doc, [
              Decoration.widget(pluginState.position, widget, {
                side: 1,
                ignoreSelection: true
              })
            ]);
          }
        }
      })
    ];
  },

  addKeyboardShortcuts() {
    return {
      // return false的话不会preventDefault
      /**
       * Tab补全
       */
      Tab: ({ editor }) => {
        console.log("editor", editor);

        const pluginState = pluginKey.getState(editor.state) as PluginState | undefined;
        // 如果 有补全建议
        if (pluginState?.suggestion && pluginState.position !== null) {
          const { suggestion, position } = pluginState;
          const { state, view } = editor;
          console.log("state", state);
          console.log("view", view);
          console.log("pluginState", pluginState);
          //创建事务
          const { tr } = state;
          // 获取鼠标当前位置
          const { selection } = state;
          const from = selection.from;
          // 插入补全建议
          tr.insertText(suggestion);
          const newCursorPos = from + suggestion.length;

          // 设置光标位置到新插入的文本末尾
          tr.setSelection(TextSelection.create(tr.doc, newCursorPos));

          // 标记为接受补全建议
          tr.setMeta("ai-complete-accept", true);
          // 触发事务
          view.dispatch(tr);
          return true;
        }
        return false;
      },

      /**
       * Escape取消补全
       */
      Escape: ({ editor }) => {
        const pluginState = pluginKey.getState(editor.state) as PluginState | undefined;
        // 如果 有补全建议 清除
        if (pluginState?.suggestion) {
          const { view } = editor;
          const { tr } = editor.state;
          view.dispatch(tr.setMeta("ai-complete-reject", false));
          return true;
        }
        // 没有补全建议 不做任何处理
        return false;
      }
    };
  }
});
