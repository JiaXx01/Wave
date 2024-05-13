import {
  HTMLAttributes,
  ReactNode,
  forwardRef,
  useCallback,
  useState
} from 'react'
import { cn } from '@/lib/utils'
import * as AccordionPrimitive from '@radix-ui/react-accordion'
import { ChevronRight } from 'lucide-react'

type TreeItemData = {
  id: string
  name: string
  children?: TreeItemData[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any
}

type TreeProps = HTMLAttributes<HTMLDivElement> & {
  data: TreeItemData[] | TreeItemData
  initiateSelectedItemId?: string
  defaultExpandedItemIds?: string[]
  icon?: ReactNode | ((item: TreeItemData) => ReactNode)
  disableConditions?: (item: TreeItemData) => boolean
  onSelectChange?: (item: TreeItemData | undefined) => void
}

const Tree = forwardRef<HTMLDivElement, TreeProps>(
  (
    {
      data,
      onSelectChange,
      initiateSelectedItemId,
      defaultExpandedItemIds = [],
      className,
      ...props
    },
    ref
  ) => {
    const [selectedItemId, setSelectedItemId] = useState<string | undefined>(
      initiateSelectedItemId
    )
    const handleSelectChange = useCallback(
      (item: TreeItemData | undefined) => {
        setSelectedItemId(item?.id)
        onSelectChange?.(item)
      },
      [onSelectChange]
    )
    return (
      <div className={className}>
        <TreeItem
          data={data}
          ref={ref}
          handleSelectChange={handleSelectChange}
          selectedItemId={selectedItemId}
          expandedItemIds={defaultExpandedItemIds}
          {...props}
        />
      </div>
    )
  }
)

type TreeItemProps = TreeProps & {
  handleSelectChange: (treeItem: TreeItemData | undefined) => void
  selectedItemId?: string
  expandedItemIds: string[]
}

const TreeItem = forwardRef<HTMLDivElement, TreeItemProps>(
  (
    {
      data,
      handleSelectChange,
      selectedItemId,
      expandedItemIds,
      className,
      icon,
      disableConditions,
      ...props
    },
    ref
  ) => {
    return (
      <div ref={ref} role="tree" className={className} {...props}>
        <ul>
          {data instanceof Array ? (
            data.map(item => {
              const disabled = disableConditions?.(item)
              return (
                <li key={item.id}>
                  {item.children ? (
                    <AccordionPrimitive.Root
                      type="multiple"
                      defaultValue={expandedItemIds}
                    >
                      <AccordionPrimitive.Item value={item.id}>
                        <AccordionTrigger
                          className={cn(
                            'gap-2 px-2 hover:before:opacity-100 before:absolute before:left-0 before:w-full before:opacity-0 before:bg-muted/80 before:h-[1.75rem] before:-z-10',
                            selectedItemId === item.id &&
                              'before:opacity-100 before:bg-accent text-accent-foreground before:border-l-2 before:border-l-accent-foreground/50 dark:before:border-0',
                            disabled && 'cursor-not-allowed text-gray-400'
                          )}
                          onClick={() => handleSelectChange(item)}
                          disabled={disabled}
                        >
                          {icon && icon instanceof Function ? icon(item) : icon}
                          <span className="text-sm truncate">{item.name}</span>
                        </AccordionTrigger>
                        <AccordionContent className="pl-6">
                          <TreeItem
                            data={item.children ? item.children : item}
                            selectedItemId={selectedItemId}
                            handleSelectChange={handleSelectChange}
                            expandedItemIds={expandedItemIds}
                            icon={icon}
                            disableConditions={disableConditions}
                          />
                        </AccordionContent>
                      </AccordionPrimitive.Item>
                    </AccordionPrimitive.Root>
                  ) : (
                    <Leaf
                      item={item}
                      isSelected={selectedItemId === item.id}
                      onClick={() => handleSelectChange(item)}
                      icon={icon}
                    />
                  )}
                </li>
              )
            })
          ) : (
            <li>
              <Leaf
                item={data}
                isSelected={selectedItemId === data.id}
                onClick={() => handleSelectChange(data)}
                icon={icon}
              />
            </li>
          )}
        </ul>
      </div>
    )
  }
)

const Leaf = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    item: TreeItemData
    isSelected?: boolean
    icon?: ReactNode | ((item: TreeItemData) => ReactNode)
  }
>(({ className, item, isSelected, icon, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'flex items-center gap-2 py-2 px-2 cursor-pointer \
        hover:before:opacity-100 before:absolute before:left-0 before:right-1 before:w-full before:opacity-0 before:bg-muted/80 before:h-[1.75rem] before:-z-10',
        isSelected &&
          'before:opacity-100 before:bg-accent text-accent-foreground before:border-l-2 before:border-l-accent-foreground/50 dark:before:border-0',
        className
      )}
      {...props}
    >
      {icon && (icon instanceof Function ? icon(item) : icon)}
      <span className="flex-grow text-sm truncate">{item.name}</span>
    </div>
  )
})

const AccordionTrigger = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn(
        'flex flex-1 w-full items-center py-2 transition-all last:[&[data-state=open]>svg]:rotate-90',
        className
      )}
      {...props}
    >
      {children}
      <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 text-accent-foreground/50 ml-auto" />
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
))
AccordionTrigger.displayName = AccordionPrimitive.Trigger.displayName

const AccordionContent = forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn(
      'overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down',
      className
    )}
    {...props}
  >
    <div className="pb-1 pt-0">{children}</div>
  </AccordionPrimitive.Content>
))
AccordionContent.displayName = AccordionPrimitive.Content.displayName

export { Tree, type TreeItemData }
