import React, { memo } from "react";
import { TouchableOpacity, Text } from "react-native"

const CustomButton = props => {
    console.log("Rendering Button", props.data())
    return (
        <TouchableOpacity
        onPress={props.action}
        >
            <Text>Render button</Text>
        </TouchableOpacity>
    )
}

export default memo(CustomButton);