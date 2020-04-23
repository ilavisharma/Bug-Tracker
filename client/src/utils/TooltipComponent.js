import React from 'react';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';

const TooltipComponent = ({ children, placement, tooltipText }) => {
  const renderTooltip = props => {
    return (
      <Tooltip id="button-tooltip" {...props}>
        {tooltipText}
      </Tooltip>
    );
  };

  return (
    <OverlayTrigger
      placement={placement}
      delay={{ show: 100, hide: 200 }}
      overlay={renderTooltip}
    >
      {children}
    </OverlayTrigger>
  );
};

export default TooltipComponent;
