import { AvatarProps } from '@radix-ui/react-avatar'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'
import { User } from 'lucide-react'

type UserAvatarProps = {
  name?: string | null
  src?: string | null
  iconSize?: string | number
} & AvatarProps

export default function UserAvatar({
  name,
  src,
  iconSize,
  ...props
}: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {src ? (
        <AvatarImage src={src} alt="Avatar"></AvatarImage>
      ) : (
        <AvatarFallback>
          <span className="sr-only">{name}</span>
          <User size={iconSize ? iconSize : 16} />
        </AvatarFallback>
      )}
    </Avatar>
  )
}
