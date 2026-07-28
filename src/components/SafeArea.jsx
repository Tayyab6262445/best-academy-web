// Replaces RN's <SafeAreaView>. Uses env(safe-area-inset-*) so the layout
// respects notches/home-indicators when installed as a mobile PWA / opened
// full-screen on iOS Safari. `edges` mirrors the RN prop (subset supported:
// top, bottom).
export default function SafeArea({ edges = ['top', 'bottom'], className = '', children }) {
  const classes = [
    edges.includes('top') ? 'safe-top' : '',
    edges.includes('bottom') ? 'safe-bottom' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return <div className={classes}>{children}</div>
}
