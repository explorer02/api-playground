import { MouseEvent, ReactNode, Ref, useCallback, useRef, useState } from 'react';
import { useClickAway } from 'react-use';

type Children = (p: { onClick: (ev: MouseEvent) => void; isOpen: boolean; ref: Ref<HTMLElement> }) => ReactNode;

type Props = {
  children: Children;
  content?: ReactNode | ((p: { close: () => void }) => ReactNode);
};

export const Popover = ({ content, children }: Props): JSX.Element => {
  const [coords, setCoords] = useState<DOMRect>();
  const popoverContainerRef = useRef<HTMLDivElement>(null);

  const childRef = useRef<HTMLElement>(null);

  const latestCoordsRef = useRef(coords);
  latestCoordsRef.current = coords;

  const onClick = useCallback((ev: MouseEvent) => {
    const domRect = ev.currentTarget.getBoundingClientRect();

    if (latestCoordsRef.current) {
      setCoords(undefined);
    } else {
      setCoords(domRect);
    }
  }, []);

  const onClose = useCallback(() => {
    setCoords(undefined);
  }, []);

  useClickAway(popoverContainerRef, ev => {
    if (childRef.current?.contains(ev.target as HTMLElement)) {
    } else {
      onClose();
    }
  });

  const childDomRect = childRef.current?.getBoundingClientRect();

  return (
    <>
      {children({ onClick, isOpen: !!coords, ref: childRef })}
      {coords && childDomRect ? (
        <div
          className="absolute border-1 border-solid spr-border-03 rounded-8 overflow-hidden p-1 spr-ui-01 spr-shadow-02"
          style={{
            zIndex: 1000,
            top: `${childDomRect.top + childDomRect.height + 10}px`,
            left: `${childDomRect.left}px`,
            right: `${childDomRect.right}px`,
            width: `${childDomRect.width}px`,
          }}
          ref={popoverContainerRef}
        >
          <div className="spr-text-01">{typeof content === 'function' ? content({ close: onClose }) : content}</div>
        </div>
      ) : undefined}
    </>
  );
};
