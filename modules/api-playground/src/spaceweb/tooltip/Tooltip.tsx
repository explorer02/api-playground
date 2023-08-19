import { MouseEvent, ReactNode, Ref, useCallback, useRef, useState } from 'react';

import './styles.css';

type Props = {
  children: (p: { onMouseEnter: (ev: MouseEvent) => void; onMouseLeave: (ev: MouseEvent) => void }) => ReactNode;
  content?: ReactNode;
};

const TIMEOUT = 300;

export const Tooltip = ({ content, children }: Props): JSX.Element => {
  const [coords, setCoords] = useState<DOMRect>();

  const timerRef = useRef<NodeJS.Timeout>();

  const onMouseEnter = useCallback((ev: MouseEvent) => {
    const domRect = ev.currentTarget.getBoundingClientRect();
    timerRef.current = setTimeout(() => {
      setCoords(domRect);
    }, TIMEOUT);
  }, []);

  const onMouseLeave = useCallback((ev: MouseEvent) => {
    clearTimeout(timerRef.current);
    setTimeout(() => {
      setCoords(undefined);
    }, TIMEOUT);
  }, []);

  return (
    <>
      {children({ onMouseEnter, onMouseLeave })}
      {coords ? (
        <div
          className="explorer-tooltip-container"
          style={{ top: `${coords.top + coords.height}px`, left: `${coords.left + coords.width / 2}px` }}
        >
          <div className="arrow-up" />
          <div className="tooltip-content">{content}</div>
        </div>
      ) : undefined}
    </>
  );
};
