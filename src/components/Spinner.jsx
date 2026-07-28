// Replaces RN's <ActivityIndicator>.
export default function Spinner({ size = 'large', color = '#E31E24', className = '' }) {
  const dimension = size === 'large' ? 36 : 20
  const border = size === 'large' ? 4 : 2

  return (
    <div
      role="status"
      aria-label="Loading"
      className={`inline-block animate-spin rounded-full border-solid ${className}`}
      style={{
        width: dimension,
        height: dimension,
        borderWidth: border,
        borderColor: color,
        borderTopColor: 'transparent',
      }}
    />
  )
}
