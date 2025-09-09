import { describe,it,expect,vi } from 'vitest'

import { currentDate,currentDateDataBase,getTime } from './Dateshelper'

describe('Dateshelper',()=>{
  it('returns formatted date and time',()=>{
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2020-01-02T15:04:05'))
    expect(currentDate()).toBe('2020-01-02')
    expect(currentDateDataBase()).toBe('2020/01/02')
    expect(getTime()).toBe('15:04:05')
    vi.useRealTimers()
  })
})
