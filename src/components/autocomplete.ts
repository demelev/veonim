import { CompletionItemKind } from 'vscode-languageserver-types'
import { CompletionOption } from '../ai/completions'
import { h, app, Actions } from '../ui/uikit'
import Icon from '../components/icon'
import { translate } from '../ui/css'

interface State {
  options: CompletionOption[],
  vis: boolean,
  ix: number,
  x: number,
  y: number,
}

interface ShowParams {
  x: number,
  y: number,
  options: CompletionOption[],
}

const state: State = {
  options: [],
  vis: false,
  ix: 0,
  x: 0,
  y: 0,
}

const getCompletionIcon = (kind: CompletionItemKind) => {
  if (kind === CompletionItemKind.Text) return Icon('shield')
  if (kind === CompletionItemKind.Method) return Icon('box', '#a673dd')
  if (kind === CompletionItemKind.Property) return Icon('disc', '#7fe2cd')
  else {
    console.warn('please implement icon for:', kind)
    return Icon('code')
  }
}

const view = ({ options, vis, ix, x, y }: State) => h('#autocomplete', {
  hide: !vis,
  style: {
    'z-index': 200,
    'min-width': '100px',
    'max-width': '300px',
    position: 'absolute',
    transform: translate(x, y),
  }
}, [
  h('div', options.map(({ text, kind }, id) => h('.row.complete', {
    key: id,
    css: { active: id === ix },
    style: {
      display: 'flex',
      'align-items': 'center',
    }
  }, [
    h('span', {
      style: {
        'margin-left': '-8px',
        background: '#ccc',
        width: '24px',
      }
    }, [
      getCompletionIcon(kind),
    ]),
    h('span', text)
  ])))
])

const a: Actions<State> = {}

a.show = (_s, _a, { options, x, y, ix = -1 }) => ({ options, ix, x, y, vis: true })
a.hide = () => ({ vis: false, ix: 0 })
a.select = (_s, _a, ix: number) => ({ ix })

const ui = app({ state, view, actions: a }, false)

export const show = (params: ShowParams) => ui.show(params)
export const select = (index: number) => ui.select(index)
export const hide = () => ui.hide()