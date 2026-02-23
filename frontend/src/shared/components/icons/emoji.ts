import { defineComponent, h } from 'vue'

export const createEmojiIcon = (emoji: string, label?: string) =>
  defineComponent({
    name: label ? `EmojiIcon${label}` : 'EmojiIcon',
    props: {
      class: {
        type: String,
        default: ''
      }
    },
    setup(props) {
      return () =>
        h(
          'span',
          {
            class: props.class,
            style: {
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              lineHeight: '1'
            },
            'aria-hidden': 'true'
          },
          emoji
        )
    }
  })
