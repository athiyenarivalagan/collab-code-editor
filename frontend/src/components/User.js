const User = ({ username }) => {
    return (
        <div className='clientItem'>
            <span className='clientItemText'>{username}</span>
        </div>
    )
}

export default User