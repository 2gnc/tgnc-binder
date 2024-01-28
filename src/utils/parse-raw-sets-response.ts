import map from 'lodash/map';
import forEach from 'lodash/forEach';
import { SetSearchT } from '../models';

export type SetsListT = Record<string, SetT>;
export type SetT = {
    code: string;
    parent: Nullable<string>;
    children: Array<SetT>;
    name: string;
    imageUri: string;
    type: string;
    block: string;
}

type SetRaw = {
    Code: string;
    Name: string;
    ParentSetCode: string;
    Type: string;
    IconURI: string;
    Block: string;
}

const buildSetData = ({ Code, Name, ParentSetCode, Type, IconURI, Block }: SetRaw): SetT => ({
    code: Code,
    name: Name,
    parent: ParentSetCode.length ? ParentSetCode : null,
    type: Type,
    imageUri: IconURI,
    children: [] as Array<SetT>,
    block: Block,
});


export function parseRawSetsResponse(sets: Array<SetRaw>) {
    const preparedSets: SetsListT = {};
    const setTypes = new Set<string>();
    const setBlocks = new Set<string>();
    const parentSets = {} as Record<string, SetSearchT>;
    const codesParents = {} as Record<string, string>;

    forEach(sets, (set) => {
        const PARENT_KEY = set.ParentSetCode.length ? set.ParentSetCode : null;

        codesParents[set.Code] = set.ParentSetCode.length ? set.ParentSetCode : set.Code;
        setBlocks.add(set.Block);
        setTypes.add(set.Type);
        if (!PARENT_KEY) {
            parentSets[set.Code] = {
                name: set.Name,
                icon: set.IconURI,
                code: set.Code,
            };
        }

        const self = buildSetData(set);

        if (PARENT_KEY) {
            preparedSets[PARENT_KEY] = {...self};
        } else {
            preparedSets[set.Code] = {...self};
        }
    });

    forEach(sets, (set) => {
        const IS_SOME_CHILD = set.ParentSetCode.length > 0;

        if (IS_SOME_CHILD) {
            preparedSets[set.ParentSetCode].children.push(buildSetData(set));
        } else {
            const self = buildSetData(set);
            const children = [...preparedSets[set.Code].children]
            preparedSets[set.Code] = { ...self };
            preparedSets[set.Code].children = [...children, self];
        }
    });

    return {
        sets: preparedSets,
        setTypes,
        setBlocks,
        codesParents,
        parentSets,
    };
}
