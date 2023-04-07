import { forwardRef } from "react"

const TaskItem = forwardRef((props, ref) => (
  <li ref={ref} {...props}>{props.children}</li>
));

TaskItem.displayName = 'TaskItem'

export default TaskItem