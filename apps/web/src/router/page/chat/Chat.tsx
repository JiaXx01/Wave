import ChatLeftArea from './ChatLeftArea'
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '@/components/ui/resizable'
export default function Chat() {
  return (
    <ResizablePanelGroup direction="horizontal" className="w-page h-full">
      <ResizablePanel maxSize={50}>
        <ChatLeftArea />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel>
        <div></div>
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}
