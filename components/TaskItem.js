export default function TaskItem({ children, ...otherProps }) {
  return <li {...otherProps}>{children}</li>
}