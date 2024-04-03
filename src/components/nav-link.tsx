import { ComponentProps } from "react";

interface INavProps extends ComponentProps<'a'> {
  children: string,
}

export function NavLink(props: INavProps) {
  return (
    <a {...props} className='font-medium text-sm'>{props.children}</a>
  )
}
