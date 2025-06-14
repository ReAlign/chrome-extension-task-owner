type T_IconType = 'edit' | 'delete' | 'confirm'
type T_IconProps = {
  size?: number
  color?: string
}
const Icon = ({
  //
  type,
  size = 24,
  color = '#fff',
}: {
  type: T_IconType
} & T_IconProps) => {
  return (
    <svg
      //
      focusable="false"
      style={{
        width: `${size}px`,
        height: `${size}px`,
        color,
      }}
    >
      <use xlinkHref={`#id-svg-${type}`} />
    </svg>
  )
}

export const IconEdit = (props: T_IconProps) => <Icon type="edit" {...props} />
export const IconDelete = (props: T_IconProps) => <Icon type="delete" {...props} />
export const IconConfirm = (props: T_IconProps) => <Icon type="confirm" {...props} />
