import { Smallify } from 'smallify'
import { SmallifyCookie, CookieOptions } from './types/options'
import { CookieSerializeOptions } from 'cookie'

declare const cookie: SmallifyCookie

export = cookie

declare module 'smallify' {
  interface CookieOptions extends CookieSerializeOptions {
    signed?: boolean
  }

  interface SmallifyPlugin {
    (plugin: SmallifyCookie, opts: CookieOptions): Smallify
  }

  interface Request {
    cookies: null | Record<string, any>
    unsignCookie(value): string | false
  }

  interface Reply {
    setCookie(name: string, value: string, options: CookieOptions): Reply
    clearCookie(name: string, options: CookieOptions): Reply
  }
}
