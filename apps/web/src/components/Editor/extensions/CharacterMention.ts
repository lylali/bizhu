import { mergeAttributes, Node } from '@tiptap/react';
import { ReactNodeViewRenderer } from '@tiptap/react';
import { CharacterMentionComponent } from './CharacterMentionComponent';
import { PluginKey } from '@tiptap/pm/state';
import { ReactRenderer } from '@tiptap/react';
import tippy from 'tippy.js';
import { CharacterSuggest } from '../CharacterSuggest';
import { useCharacterStore } from '../../../stores/characterStore';

export interface CharacterMentionOptions {
  HTMLAttributes: Record<string, any>;
  renderLabel: (props: { options: CharacterMentionOptions; node: any }) => string;
  suggestion: any;
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    characterMention: {
      /**
       * Add a character mention
       */
      setCharacterMention: (attributes: { id: string; label: string }) => ReturnType;
    };
  }
}

export const CharacterMention = Node.create<CharacterMentionOptions>({
  name: 'characterMention',

  addOptions() {
    return {
      HTMLAttributes: {},
      renderLabel({ options, node }) {
        return `${options.suggestion.char || ''}${node.attrs.label || node.attrs.id}`;
      },
      suggestion: {
        char: '@',
        pluginKey: new PluginKey('characterMention'),
        command: ({ editor, range, props }) => {
          // 插入 mention 节点
          editor
            .chain()
            .focus()
            .insertContentAt(range, [
              {
                type: this.name,
                attrs: props,
              },
              {
                type: 'text',
                text: ' ',
              },
            ])
            .run();
        },
        allow: ({ state, range }) => {
          const $from = state.doc.resolve(range.from);
          const type = state.schema.nodes[this.name];
          const allow = !!$from.parent.type.contentMatch.matchType(type);

          return allow;
        },
        items: ({ query }) => {
          const characters = useCharacterStore.getState().characters;
          if (!query) return characters.slice(0, 5); // 返回前5个角色

          const filtered = characters.filter(character => {
            const name = character.name.toLowerCase();
            const aliases = character.aliases?.toLowerCase() || '';
            const term = query.toLowerCase();

            return name.includes(term) || aliases.includes(term);
          });

          return filtered.slice(0, 10); // 最多返回10个结果
        },
        render: () => {
          let component: ReactRenderer | null = null;
          let popup: any = null;

          return {
            onStart: (props) => {
              component = new ReactRenderer(CharacterSuggest, {
                props,
                editor: props.editor,
              });

              if (!props.clientRect) {
                return;
              }

              popup = tippy('body', {
                getReferenceClientRect: props.clientRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: 'manual',
                placement: 'bottom-start',
                arrow: false,
              });
            },

            onUpdate: (props) => {
              component?.updateProps(props);

              if (!props.clientRect) {
                return;
              }

              popup?.setProps({
                getReferenceClientRect: props.clientRect,
              });
            },

            onKeyDown: (props) => {
              if (props.event.key === 'Escape') {
                popup?.hide();
                return true;
              }

              return component?.ref?.onKeyDown(props) || false;
            },

            onExit: () => {
              popup?.destroy();
              component?.destroy();
            },
          };
        },
      },
    };
  },

  group: 'inline',

  inline: true,

  selectable: false,

  atom: true,

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: element => element.getAttribute('data-id'),
        renderHTML: attributes => {
          if (!attributes.id) {
            return {};
          }

          return {
            'data-id': attributes.id,
          };
        },
      },

      label: {
        default: null,
        parseHTML: element => element.getAttribute('data-label'),
        renderHTML: attributes => {
          if (!attributes.label) {
            return {};
          }

          return {
            'data-label': attributes.label,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: `span[data-type="${this.name}"]`,
      },
    ];
  },

  renderHTML({ node, HTMLAttributes }) {
    return [
      'span',
      mergeAttributes(
        { 'data-type': this.name },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
      this.options.renderLabel({
        options: this.options,
        node,
      }),
    ];
  },

  renderText({ node }) {
    return this.options.renderLabel({
      options: this.options,
      node,
    });
  },

  addNodeView() {
    return ReactNodeViewRenderer(CharacterMentionComponent);
  },

  addCommands() {
    return {
      setCharacterMention:
        (attributes) =>
        ({ commands }) => {
          return commands.setNode(this.name, attributes);
        },
    };
  },

  addKeyboardShortcuts() {
    return {
      Backspace: () =>
        this.editor.commands.command(({ tr, state }) => {
          let isMention = false;
          const { selection } = state;
          const { empty, anchor } = selection;

          if (!empty) {
            return false;
          }

          state.doc.nodesBetween(anchor - 1, anchor, (node, pos) => {
            if (node.type.name === this.name) {
              isMention = true;
              tr.insertText(
                this.options.renderLabel({
                  options: this.options,
                  node,
                }),
                pos,
                pos + node.nodeSize,
              );

              return false;
            }
          });

          return isMention;
        }),
    };
  },
});