import React from 'react'

export function Navigation({ onRouteChange, isSignedIn }) {
  if (isSignedIn) {
    return (
      <nav style={{ display: 'flex', justifyContent: 'right' }}>
        <p onClick={() => onRouteChange('signOut')} className='f3 link dim black underline pa3 pointer'>Sing Out</p>
      </nav>
    );
  } else {
    return (
      <nav style={{ display: 'flex', justifyContent: 'right' }}>
        <p onClick={() => onRouteChange('signIn')} className='f3 link dim black underline pa3 pointer'>Sing In</p>
        <p onClick={() => onRouteChange('register')} className='f3 link dim black underline pa3 pointer'>Register</p>
      </nav>
    );
  }
}
