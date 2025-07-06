import { Badge } from '@/components/ui/badge';

type BadgesProps = {
    tags: string[];
};

export default function Badges({ tags }: BadgesProps) {
    return (
        <div className="mt-2 flex flex-wrap items-center gap-2">
            {tags.map((tag) => (
                <Badge key={tag}>{tag}</Badge>
            ))}
        </div>
    );
}
