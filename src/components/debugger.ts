import { userSelectStack, userSelectScope } from '../ai/debug'
import { PluginRight } from '../components/plugin-container'
import { DebugProtocol as DP } from 'vscode-debugprotocol'
import { paddingVH } from '../ui/css'
import { h, app } from '../ui/uikit'

type Threads = DP.Thread[]
type Stacks = DP.StackFrame[]
type Scopes = DP.Scope[]
type Variables = DP.Variable[]

const state = {
  visible: false,
  threads: [] as Threads,
  stackFrames: [] as Stacks,
  scopes: [] as Scopes,
  variables: [] as Variables,
  activeThread: 0,
  activeStack: 0,
  activeScope: 0,
}

type S = typeof state

const actions = {
  show: () => ({ visible: true }),
  hide: () => ({ visible: false }),
  updateState: (m: any) => m,
}

type A = typeof actions

const header = (title: string) => h('div', {
  style: {
    ...paddingVH(8, 8),
    background: 'rgba(255, 255, 255, 0.1)',
    fontWeight: 'bold',
  },
}, title)

const ListItem = (name: string, active: boolean, clickFn: Function) => h('div', {
  style: {
    ...paddingVH(8, 4),
    background: active ? 'rgba(255, 255, 255, 0.05)' : undefined,
  },
  onclick: clickFn,
}, name)

const view = ($: S, a: A) => PluginRight($.visible, {
  // TODO: TESTING ONLY
  zIndex: 99999999,
}, [

  ,h('div', [
    ,header('Threads')
    ,h('div', $.threads.map(m => ListItem(
      m.name,
      $.activeThread === m.id,
      () => console.log('pls change thread to:', m.id),
    )))
  ])

  ,h('div', [
    ,header('Stacks')
    ,h('div', $.stackFrames.map(m => ListItem(
      m.name,
      $.activeStack === m.id,
      () => {
        userSelectStack(m.id)
        a.updateState({ activeStack: m.id })
      }
    )))
  ])

  ,h('div', [
    ,header('Scopes')
    ,h('div', $.scopes.map(m => ListItem(
      m.name,
      $.activeScope === m.variablesReference,
      () => {
        userSelectScope(m.variablesReference)
        a.updateState({ activeScope: m.variablesReference })
      }
    )))
  ])

  ,h('div', [
    ,header('Variables')
    ,h('div', $.variables.map(m => ListItem(
      `${m.name} -> ${m.value}`,
      false,
      () => console.log('pls get var:', m.value),
    )))
  ])

])

export default app<S, A>({ name: 'debugger', state, actions, view })
