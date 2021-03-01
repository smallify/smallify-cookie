import { Smallify, PluginOptions } from 'smallify'

export class CookieOptions extends PluginOptions {
  secret?: string
}

export type SmallifyCookie = {
  (smallify: Smallify, opts: CookieOptions): Promise<void>
}
