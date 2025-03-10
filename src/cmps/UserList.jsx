import { UserPreview } from './UserPreview.jsx'

export function UserList({ users, onRemoveUser, onUpdateUser }) {
    return (
        <section className='user-list'>
            {users.map(user => (
                <UserPreview key={user._id} user={user} onRemoveUser={onRemoveUser} onUpdateUser={onUpdateUser} />
            ))}
        </section>
    )
}
