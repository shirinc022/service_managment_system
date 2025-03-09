import { createSlice } from '@reduxjs/toolkit'


const initialState = {
    user:{},
  }

  export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        saveUser: (state, action) => {
            state.user = action.payload
        },
        clearUser: (state) => {
          state.user = {}
        },
        
    },
  })

  export const { saveUser, clearUser} = userSlice.actions

  export const userReducer = userSlice.reducer;
  
//   export default userSlice.reducer