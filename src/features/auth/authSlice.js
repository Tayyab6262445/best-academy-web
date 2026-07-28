import { createSlice } from '@reduxjs/toolkit'

const STORAGE_KEY = 'best-academy:auth'

// Deliberate web adaptation (see TICKETS.md TICKET-05): the RN app keeps auth
// state in memory only. On the web a page refresh is routine, so the session
// is persisted to localStorage to avoid logging the student out constantly.
function loadPersistedUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

const persistedUser = loadPersistedUser()

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: persistedUser, // student object { studentId, name, rollNumber, ... }
    isAuthenticated: Boolean(persistedUser),
  },
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload
      state.isAuthenticated = true
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(action.payload))
      } catch {
        // ignore storage failures (e.g. private browsing)
      }
    },
    logout: (state) => {
      state.user = null
      state.isAuthenticated = false
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // ignore storage failures
      }
    },
  },
})

export const { setCredentials, logout } = authSlice.actions
export default authSlice.reducer

export const selectCurrentUser = (state) => state.auth.user
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated
