// Replaces RN's <TouchableOpacity>: an unstyled button with an opacity dip
// on press, matching activeOpacity behavior. Renders a <button> by default;
// pass as="div" for non-interactive-semantics wrappers (rare).
export default function Pressable({
  as: Component = 'button',
  className = '',
  disabled = false,
  activeOpacity = 0.7,
  onClick,
  children,
  style,
  type,
  ...rest
}) {
  return (
    <Component
      type={Component === 'button' ? type || 'button' : undefined}
      disabled={Component === 'button' ? disabled : undefined}
      onClick={disabled ? undefined : onClick}
      className={`transition-opacity duration-100 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
      style={{ '--active-opacity': activeOpacity, ...style }}
      onMouseDown={(e) => {
        if (!disabled) e.currentTarget.style.opacity = String(activeOpacity)
      }}
      onMouseUp={(e) => {
        if (!disabled) e.currentTarget.style.opacity = ''
      }}
      onMouseLeave={(e) => {
        if (!disabled) e.currentTarget.style.opacity = ''
      }}
      {...rest}
    >
      {children}
    </Component>
  )
}
