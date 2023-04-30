// Imports
const helper = require('./helper.js');
const generic = require('./genericElements.jsx');
const React = require('react');
const ReactDOM = require('react-dom');
const { result } = require('underscore');

// Displays the Search Results on the Webpage
const displaySearch = (result, type) => {
    console.log(result);

    if (type === '/searchSong') {
        ReactDOM.render(
            <generic.SongList songs={result.searchResult} />,
            document.getElementById('userContent')
        );
    }
    else {
        ReactDOM.render(
            <generic.AccountList users={result.searchResult} />,
            document.getElementById('userContent')
        );
    }
}


const searchCallback = async (e) => {
    e.preventDefault();
    helper.hideError();

    const search = e.target.querySelector('#searchQuery').value;
    const type = e.target.querySelector('#searchSelect').value
    
    // If missing value, prevent search
    if (!search || !type) {
        helper.handleError('Missing Search Parameter');
    }

    const url = `${type}?search=${search}`;
    
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    displaySearch(await response.json(), type);
}


const handleSong = async (e) => {
    // Prevent Default and Hide Error Message
    e.preventDefault();
    helper.hideError();

    const response = await fetch('/songUp', {
        method: 'POST',
        body: new FormData(e.target),
    });

    const pageUser = window.location.search.split('=')[1];
    const result = await generic.checkLogin();
    loadSongsFromServer(pageUser, result.loggedIn);

    return false;

    /*
    // Gets the Parameters
    const name = e.target.querySelector('#domoName').value;
    const age = e.target.querySelector('#domoAge').value;
    const job = e.target.querySelector('#domoJob').value;

    // If There is a Missing Parameter
    if (!name || !age || !job) {
        helper.handleError('All Fields Are Required!');
        return false;
    }

    // Sends the Post
    helper.sendPost(e.target.action, {name, age, job}, loadDomosFromServer);
    return false;
    */
};

// Song Upload Component
const SongForm = (props) => {
    return(
        <form id='uploadForm'
            onSubmit={handleSong}
            name='uploadForm'
            action='/songUp'
            method='POST'
            className='uploadForm'
            encType='multipart/form-data'
        >
            <input type='file' name='songFile' />
            <label htmlFor='fileName'>Song Name:</label>
            <input id='fileNameInput' type='text' name='fileName' placeholder='AHHHHHHHHHHHHHHHHHHHH' />
            <input type='submit' value='Upload Song!' />
        </form>
    );
    
};

// Checks if a song is liked
const songLiked = async (id) => {
    const response = await fetch(`/checkLike?id=${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    const result = await response.json();
    console.log(result);
    return result.responseJson.result;
};

// Song List Component
const SongList = (props) => {    
    // If there are no Songs
    if(props.songs.length === 0){
        return (
            <div className='songList'>
                <h3 className='emptySong'>No Songs Yet!</h3>
            </div>
        );
    }

    // Maps the Songs to a Div
    const songNodes = props.songs.map(song => {
        return(
            <div key={song._id} className='song'>
                <h3 className='SongName'>Name: {song.name}</h3>
                <audio controls src={'/retrieve?_id=' + song._id} />
                {props.loggedIn &&
                    <label for='like'>Like: </label> 
                }
                {props.loggedIn &&
                    <input id={song._id} class='liked' type='checkbox' onChange={(e) => {
                        const id = song._id;
                        const checked = e.target.checked;
                        helper.sendPost('/updateLiked', {id, checked});
                    }} /> 
                }
                {props.owner &&
                    <button hidden={props.owner} className='delete' type='button' onClick={async () => {
                        const response = await fetch('/deleteSong', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({id: song._id}),
                        });
                        const pageUser = window.location.search.split('=')[1];
                        const result = await generic.checkLogin();
                        loadSongsFromServer(pageUser, result.loggedIn);
                    }}>Delete</button>
                }
            </div>
        );
    });
    

    // Calls the Above Function
    return(
        <div className='songList'>
            {songNodes}
        </div>
    );
};

// Loads Domos From a Server and Renders a DomoList component
const loadSongsFromServer = async (user, _loggedIn) => {
    const response = await fetch(`/retrieveUser${window.location.search}`);
    const data = await response.json();
    if (data.redirect){
        return window.location.href = data.redirect;
    }

    if (data.error){
        return helper.handleError(data.error);
    }

    ReactDOM.render(
        <SongList songs={data.songs} owner={data.owner} loggedIn={_loggedIn}/>, document.getElementById('userContent')
    );

    const likedCheckboxes = document.getElementsByClassName('liked');
    console.log(likedCheckboxes[0]);
    if (likedCheckboxes){
        for (let i = 0; i < likedCheckboxes.length; i++){
            const result = await songLiked(likedCheckboxes[i].id)
            if (result){
                console.log('Check ' + i);
                likedCheckboxes[i].checked = true;
            }
        }
    }
};

// Init
const init = async () => {
    ReactDOM.render(
        <generic.SearchBar callback={searchCallback} />,
        document.getElementById('search')
    );

    const result = await generic.checkLogin();
    const pageUser = window.location.search.split('=')[1];
    console.log(pageUser);

    if (result.loggedIn && pageUser === result.username){
        ReactDOM.render(
            <SongForm />,
            document.getElementById('userData')
        );
    }

    ReactDOM.render(
        <SongList songs={[]} />,
        document.getElementById('userContent')
    );

    loadSongsFromServer(pageUser, result.loggedIn);

    // Renders the Component to the screen
    ReactDOM.render(
        <generic.AccountDropdown loggedIn={result.loggedIn} username={result.username} />,
        document.getElementById('header')
    );
};

window.onload = init;