import { MembersPreview } from "./MembersPreview";

export function MembersList({ members, onAdd, onRemove }) {
    return (
        <ul className='members-list'>
          
                {members.map(member => (
                    <li className="members-preview" key={member._id}>
                        <MembersPreview member={member} onAdd={onAdd} onRemove={onRemove} />
                    </li>
                ))}
            
        </ul>
    )
}