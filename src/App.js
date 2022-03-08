import { React, useState } from 'react'
import './App.css';
import { Navigation } from './components/Navigation.js'
import { FaceRecognition } from './components/FaceRecognition.js'
import { SignIn } from './components/SignIn.js'
import { Register } from './components/Register.js'
import Clarifai from 'clarifai'
import { Logo } from './components/Logo.js'
import { ImageLinkForm } from './components/ImageLinkForm.js'
import { Rank } from './components/Rank.js'
import Particles from 'react-tsparticles';
import 'tachyons';
//You must add your own API key here from Clarifai.

const app = new Clarifai.App({
  apiKey: "API-KEY-HERE"
});

const particlesOptions = {
  particles: {
    number: {
      value:30,
      density: {
        enable: true,
        value_area: 800
      }
    },
    move: {
      direction: "none",
      enable: true,
      random: false,
      speed: 4,
      straight: false,
    },
  }
}

function App() {

  const [input, setInput] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [box, setBox] = useState({});
  const [route, setRout] = useState('signIn');
  const [isSignedIn, SetisSignedIn] = useState(false);
  const [user, setUser] = useState({ id: '', name: '', email: '', entries: 0, joined: ''});

  const loadUser = () => {
    setUser(  
      {
        id: user.id,
        name: user.name,
        email: user.email,
        entries: user.entries,
        joined: user.joined
      }
    )
    }

  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputImage');
    const width = Number(image.width);
    const height = Number(image.height);

    const newBox = {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
    console.log(newBox);

    setBox({ box: newBox })
  }

  const onInputChange = (event) => {
    setInput(event.target.value);
  }

  const onButtonSubmit = () => {
    setImageURL(input)
    app.models
      .predict(Clarifai.FACE_DETECT_MODEL, input)
      .then(response => calculateFaceLocation(response))
      .catch(err => console.log(err))
  }

  const onRouteChange = (route) => {
    if (route === 'signOut') {
      SetisSignedIn(false)
    } else if (route === 'home') {
      SetisSignedIn(true)
    }

    setRout(route);
  }



  return (
    <div className="App">
       <Particles className='particles'
          params={particlesOptions}
        />
      <Navigation isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
      {route === 'home'
        ?
        <div>
          <Logo />
          <Rank name={user.name} entries={user.entries}/>
          <ImageLinkForm onInputChange={onInputChange} onButtonSubmit={onButtonSubmit} />
          <FaceRecognition imageURL={imageURL} box={box} />
        </div>
        : (
          route === 'signIn'
            ?
            <SignIn onRouteChange={onRouteChange} loadUser={loadUser}/>
            :
            <Register onRouteChange={onRouteChange} loadUser={loadUser} />
        )
      }
    </div>
  );
}

export default App;
