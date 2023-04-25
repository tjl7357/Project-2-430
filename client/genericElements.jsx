// Imports
const helper = require('./helper.js');
const React = require('react');
const ReactDOM = require('react-dom');

// Search Bar Component
const SearchBar = (props) => {    
    return(
        <form id='searchForm'
            onSubmit={props.callback}
            name='searchForm'
            action='/search'
            method='POST'
            className='searchForm'
            encType='multipart/form-data'
        >
            <label htmlFor='query'>Search:</label>
            <input id='searchQuery' type='text' name='query' placeholder='DOES NOT WORK YET' />
            <select id='searchSelect' name='searchOptions'>
                <option value='/searchSong'>Song</option>
                <option value='/searchUser'>User</option>
            </select>
            <input type='submit' value='Search' />
        </form>
    );
};


// Account Dropdown Component
const AccountDropdown = (props) => {
    // Creates the List Elements depending if logged in or not
    let actions;
    if (props.loggedIn){
        actions =
            <ul id='accountActions'>
                <li><a href={'/account?user=' + props.username} id='accountAction'>Account</a></li>
                <li><a href='/changePass' id='changePassAction'>Change Password</a></li>
                <li><a href='/logout' id='logoutAction'>Logout</a></li>
            </ul>;
    } else {
        actions =
            <ul id='accountActions'>
                <li><a href='/login' id='loginAction'>Login/Signup</a></li>
            </ul>;
    }
    
    return(
        <div id='accountDropdown'>
            <h3>AccountActions</h3>
            {actions}
        </div>
    );
};

// Song List Component
const SongList = (props) => {
    console.log(props.songs);

    // If there are no songs found
    if(props.songs.length === 0){
        return (
            <div className='songList'>
                <h3 className='emptySong'>No Songs Yet!</h3>
            </div>
        );
    }

    // Maps the song to elements
    const songNodes = props.songs.map(song => {
        return(
            <div key={song._id} className='song'>
                <h3><a href={'/account?user=' + song.owner}>Artist: {song.owner}</a></h3>
                <h3>Song Name: {song.name}</h3>
                <audio controls src={'/retrieve?_id=' + song._id} />
            </div>
        );
    });

    // Calls songNodes
    return(
        <div className='songList'>
            {songNodes}
        </div>
    );
};

// Account List Component
const AccountList = (props) => {
    // If there are no songs found
    if(props.users.length === 0){
        return (
            <div className='userList'>
                <h3 className='emptyUser'>No Users Found!</h3>
            </div>
        );
    }

    // Maps the song to elements
    const userNodes = props.users.map(user => {
        return(
            <div key={user._id} className='user'>
                <h3><a href={'/account?user=' + user.username}>User: {user.username}</a></h3>
            </div>
        );
    });

    // Calls songNodes
    return(
        <div className='userList'>
            {userNodes}
        </div>
    );
};

// Function for checking if a user is logged in
const checkLogin = async () => {
    // Checks if logged in and gets the username
    const response = await fetch('/checkLogin');
    return result = await response.json();
}

module.exports = {
    checkLogin,
    SearchBar,
    AccountDropdown,
    SongList,
    AccountList,
}