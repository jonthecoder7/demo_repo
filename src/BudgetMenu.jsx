import React, { useState, useEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import './BudgetMenu.css';
import * as mobxReact from 'mobx-react-lite';
import * as mobx from 'mobx';

// Constants for layout spacing
const THREE_DOTS_WIDTH = 50;  // The width of the three dots” button
const BUTTON_SPACING = 8;     // Spacing between buttons
const PADDING = 32;           // Extra padding space to consider

const BudgetMenu = ({ title, buttons, onButtonClick }) => {
  //Buttons that are shown directly in the menu
  const [visibleButtons, setVisibleButtons] = useState([]);
  //Buttons that don’t fit and are hidden in overflow menu
  const [hiddenButtons, setHiddenButtons] = useState([]);
  //Whether the overflow menu is open
  const [showOverflowMenu, setShowOverflowMenu] = useState(false);

  // Refs to DOM elements for measuring sizes
  const containerRef = useRef(null);  // Whole menu container
  const buttonBarRef = useRef(null);  // The bar where buttons sit
  const titleRef = useRef(null);      // The title element

  //Function to calculate which buttons can fit in the available horizontal space.
  //It sorts buttons by priority and adds them one by one until space runs out.

  const calculateButtonVisibility = useCallback(() => {
    if (!containerRef.current || !buttonBarRef.current || !titleRef.current) return;

    // Measure widths of container and title
    const containerWidth = containerRef.current.offsetWidth;
    const titleWidth = titleRef.current.offsetWidth;

    // Calculate how much space is available for buttons
    const availableWidth = containerWidth - titleWidth - THREE_DOTS_WIDTH - PADDING;

    let currentWidth = 0;
    const visible = [];
    const hidden = [];

    // Sort buttons by priority (lower number = higher priority)
    const sortedButtons = [...buttons].sort((a, b) => (a.priority || 999) - (b.priority || 999));

    // Try to fit buttons one by one
    for (let button of sortedButtons) {
      // Estimate button width: label length * char width + padding + spacing
      const buttonWidth = (button.label.length * 8) + 32 + BUTTON_SPACING;

      if (currentWidth + buttonWidth <= availableWidth && visible.length < 4) {
        visible.push(button);
        currentWidth += buttonWidth;
      } else {
        hidden.push(button); // Doesn't fit, go to overflow
      }
    }

    // Update state with visible and hidden buttons
    setVisibleButtons(visible);
    setHiddenButtons(hidden);
  }, [buttons]);  // Recalculate when buttons change

  //Effect Hook to run when the component mounts, buttons change, or window resizes.
  //Ensures the menu recalculates button visibility responsively.

  useEffect(() => {
    calculateButtonVisibility();
    const handleResize = () => calculateButtonVisibility();

    // Listen to window resize
    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => window.removeEventListener('resize', handleResize);
  }, [calculateButtonVisibility]);

  //Handles when a button is clicked.
  //Adds a CSS class briefly for a click animation effect.
  //Calls the provided onButtonClick prop with button data.

  const handleButtonClick = useCallback((button, event) => {
    event.currentTarget.classList.add('button-clicked');
    setTimeout(() => {
      event.currentTarget.classList.remove('button-clicked');
    }, 150);

    if (onButtonClick) onButtonClick(button);
  }, [onButtonClick]);

  /**
   * Toggles the visibility of the overflow “three dots” menu.
   */
  const toggleOverflowMenu = useCallback(() => {
    setShowOverflowMenu(prev => !prev);
  }, []);

  // JSX Rendering
  return (
    <div className="budget-menu" ref={containerRef}>
      {/* Title Section */}
      <div className="title-section">
        <h2 className="header-title" ref={titleRef}>
          {title}
        </h2>
      </div>

      {/* Button Bar Section */}
      <div className="button-bar" ref={buttonBarRef}>
        {/* Render visible buttons directly */}
        {visibleButtons.map(button => (
          <button
            key={button.id}
            className="menu-button"
            onClick={(e) => handleButtonClick(button, e)}
            title={button.label}
          >
            {button.icon && <i className={`button-icon ${button.icon}`}></i>}
            <span className="button-label">{button.label}</span>
          </button>
        ))}

        {/* If there are hidden buttons, show the overflow menu button */}
        {hiddenButtons.length > 0 && (
          <>
            <button
              className="three-dot-button"
              onClick={toggleOverflowMenu}
              title="More options"
              aria-haspopup="true"
              aria-expanded={showOverflowMenu}
            >
              ⋮
            </button>

            {/* Render Overflow Menu Dropdown if open */}
            {showOverflowMenu && (
              <div className="overflow-menu">
                <div className="overflow-menu-content">
                  {hiddenButtons.map(button => (
                    <button
                      key={button.id}
                      className="overflow-menu-item"
                      onClick={(e) => {
                        handleButtonClick(button, e);
                        setShowOverflowMenu(false);  // Close menu after click
                      }}
                    >
                      {button.icon && <i className={`button-icon ${button.icon}`}></i>}
                      <span>{button.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Overlay Backdrop to close overflow menu when clicking outside */}
      {showOverflowMenu && (
        <div
          className="overflow-backdrop"
          onClick={() => setShowOverflowMenu(false)}
        />
      )}
    </div>
  );
};

// Prop Types validation
BudgetMenu.propTypes = {
  title: PropTypes.string,
  buttons: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string.isRequired,
      icon: PropTypes.string,
      priority: PropTypes.number,
    })
  ),
  onButtonClick: PropTypes.func,
};

// Default props
BudgetMenu.defaultProps = {
  title: 'Budget Page',
  buttons: [],
  onButtonClick: null,
};

export default BudgetMenu;
