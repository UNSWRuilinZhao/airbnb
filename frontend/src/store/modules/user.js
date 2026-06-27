import { createSlice } from '@reduxjs/toolkit'

export const counterSlice = createSlice({
  name: 'user',
  initialState: {
    token: null,
    userInfo: null
  },
  reducers: {
    setUserInfo (state, action) {
      state.userInfo = action.payload.userInfo
    },
    setToken (state, action) {
      state.token = action.payload.token
    }
  }
})
// 每个 case reducer 函数会生成对应的 Action creators
export const { setToken, setUserInfo } = counterSlice.actions

export default counterSlice.reducer
