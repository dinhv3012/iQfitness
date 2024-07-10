import React from "react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const SelectComponent = ({ options, onChange, label }) => {

    return (
        <FormControl fullWidth>
            <InputLabel id="selectLabel">{label}</InputLabel>
            <Select
                labelId="selectLabel"
                id="select"
                label={label}
                defaultValue=""
                onChange={onChange}
            >
                <MenuItem value="">None</MenuItem>
                {Object.keys(options).map((key, index) => {
                    return (
                        <MenuItem key={index} value={key}>{options[key]}</MenuItem>
                    )
                })}
            </Select>
        </FormControl>
    )
}

export default SelectComponent;