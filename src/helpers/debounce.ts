export function debounce (fn: { apply: (arg0: any, arg1: IArguments) => void; }, delay = 300) {
  let timer: string | number | NodeJS.Timeout

  return function (...args: any[]) {
    const _this = this
    if (timer) {
      clearTimeout(timer)
    }

    timer = setTimeout(function () {
      fn.apply(_this, args as unknown as IArguments)
      timer = null
    }, delay)
  }
}
