import React, { useState, useEffect } from 'react';
import socketService from '../services/socketService';
import './ColorPalette.css';

const ColorPalette = () => {
  const [selectedColor, setSelectedColor] = useState('#ffffff');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [isConnected, setIsConnected] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [connectedUsers, setConnectedUsers] = useState(0);

  // Predefined color palette
  const colors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
    '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9',
    '#F8C471', '#82E0AA', '#F1948A', '#85C1E9', '#D7BDE2',
    '#A3E4D7', '#F9E79F', '#FADBD8', '#D5DBDB', '#2C3E50',
    '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
    '#1ABC9C', '#34495E', '#E67E22', '#E91E63', '#8E44AD'
  ];

  useEffect(() => {
    // Connect to socket server
    socketService.connect();

    // Set up event listeners
    socketService.on('connect', () => {
      setIsConnected(true);
      socketService.emit('join_color_room');
    });

    socketService.on('disconnect', () => {
      setIsConnected(false);
    });

    socketService.on('color_changed', (data) => {
      console.log('Color changed by another user:', data.color);
      setBackgroundColor(data.color);
      setSelectedColor(data.color);
    });

    socketService.on('users_count', (count) => {
      setConnectedUsers(count);
    });

    socketService.on('current_color', (data) => {
      setBackgroundColor(data.color);
      setSelectedColor(data.color);
    });

    // Cleanup on unmount
    return () => {
      socketService.disconnect();
    };
  }, []);

  // Apply background color to body
  useEffect(() => {
    document.body.style.backgroundColor = backgroundColor;
    document.body.style.transition = 'background-color 0.5s ease';
    
    return () => {
      document.body.style.backgroundColor = '';
      document.body.style.transition = '';
    };
  }, [backgroundColor]);

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setIsDropdownOpen(false);
  };

  const handleApplyColor = () => {
    // Always apply the color locally first
    setBackgroundColor(selectedColor);
    
    if (isConnected && selectedColor) {
      // Send color change to server if connected
      socketService.emit('change_color', { color: selectedColor });
      console.log('Color sent to server:', selectedColor);
    } else {
      console.log('Applied color locally (server not connected):', selectedColor);
    }
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="color-palette-container">
      <div className="color-palette-header">
        <h2>Real-time Color Sync</h2>
        <div className={`connection-status ${isConnected ? 'connected' : 'disconnected'}`}>
          {isConnected ? `🟢 Connected (${connectedUsers} users)` : '🔴 Disconnected'}
        </div>
      </div>

      <div className="color-palette-content">
        <div className="color-selector">
          <label htmlFor="color-dropdown">Choose a color:</label>
          
          <div className="dropdown-container">
            <button 
              className="dropdown-button"
              onClick={toggleDropdown}
              disabled={false}
              style={{ backgroundColor: selectedColor }}
            >
              <span className="selected-color-text">
                {selectedColor.toUpperCase()}
              </span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {isDropdownOpen && (
              <div className="dropdown-content">
                <div className="color-grid">
                  {colors.map((color, index) => (
                    <button
                      key={index}
                      className={`color-option ${selectedColor === color ? 'selected' : ''}`}
                      style={{ backgroundColor: color }}
                      onClick={() => handleColorSelect(color)}
                      title={color}
                    >
                      {selectedColor === color && <span className="checkmark">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <button 
          className="apply-button"
          onClick={handleApplyColor}
          disabled={!selectedColor}
        >
          {isConnected ? 'Apply Color to All Clients' : 'Apply Color Locally'}
        </button>

        <div className="color-info">
          <div className="current-color">
            <strong>Current Background Color: </strong>
            <span style={{ 
              backgroundColor: backgroundColor, 
              padding: '4px 8px', 
              borderRadius: '4px',
              border: '1px solid #ccc',
              color: backgroundColor === '#ffffff' || backgroundColor === '#FFEAA7' ? '#333' : '#fff'
            }}>
              {backgroundColor.toUpperCase()}
            </span>
          </div>
          <br />
          <br />
          <br />
          <div className="instructions">
            {isConnected ? (
              <>
                <p>💡 Select a color from the palette and click "Apply Color" to change the background.</p>
                <p>🌐 All connected users will see the same background color change in real-time!</p>
              </>
            ) : (
              <>
                <p>💡 Select a color from the palette and click "Apply Color" to change the background locally.</p>
                <p>🔌 Start the server with "npm run server" in another terminal for real-time sync!</p>
                <p>🌐 Once connected, color changes will sync across all clients!</p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorPalette;
