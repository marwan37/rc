import { Resizable } from 're-resizable';
import styles from './ResizablePanel.module.css';
import { useState } from 'react';

interface ResizablePanelProps {
  children: React.ReactNode;
  width?: string | number;
  minWidth?: string | number;
  maxWidth?: string | number;
}

const ResizablePanel: React.FC<ResizablePanelProps> = ({ children, width, minWidth, maxWidth }) => {
  const [isResizing, setIsResizing] = useState(false);

  return (
    <Resizable
      className={styles.resizablePanel}
      defaultSize={{ width: width || '20%', height: '100%' }}
      minWidth={minWidth || '10%'}
      maxWidth={maxWidth || '50%'}
      onResizeStart={() => setIsResizing(true)}
      onResizeStop={() => setIsResizing(false)}
      handleComponent={{
        right: isResizing ? <div className={styles.resizingClas} /> : <div className={styles.handleClass} />
      }}
      handleClasses={{ right: isResizing ? styles.resizingClass : styles.handleClass }}
      enable={{ right: true }}>
      {children}
    </Resizable>
  );
};

export default ResizablePanel;
