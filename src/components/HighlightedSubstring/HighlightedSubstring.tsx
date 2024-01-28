import React, { type FC } from 'react';
import { Text, TEXT_COLORS } from '@gravity-ui/uikit';

type PropsT = {
    text: string;
    substring: string;
    color: (typeof TEXT_COLORS)[number];
}

export const HighlightedSubstring: FC<PropsT> = ({ text, substring, color }) => {
    const re = new RegExp(substring, 'gi');
    const match = text.match(re);
    if (!match) return (
        <Text>{text}</Text>
    )

    return (
        <div>
            {
                text.replace(re, `--${match[0]}--`).split('--').map((chunk, i) => {
                    if (chunk.toLowerCase() !== substring.toLowerCase()) {
                        return <Text key={ `${text}${i}` }>{chunk}</Text>
                    }
                    return <Text color={ color } key={ `${text}${i}` }><b>{match[0]}</b></Text>
                })
            }
        </div>
    ) 
}
