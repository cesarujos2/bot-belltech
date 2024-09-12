export const auth = (password: string) => {
  return password == import.meta.env.MAIN_VITE_PASS
}
