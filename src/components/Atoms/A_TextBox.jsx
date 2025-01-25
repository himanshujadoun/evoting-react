import { TextField } from "@mui/material";
import PropTypes from "prop-types";

const styles = (theme) => ({
  textField: {
    color: "red",
    width: "90%",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 0,
    marginTop: 0,
    fontWeight: 500,
  },
  input: {
    color: "red",
  },
});

const A_TextBox = (props) => {
  const onValueChange = (e) => {
    props.onChange(e);
  };

  const onInputChange = (e) => {
    props.onInput(e);
  };

  return (
    <TextField
      InputProps={{
        className: styles.textField,
        ...props.InputProps,
      }}
      id={props.id}
      className={styles.textField}
      onInput={(e) => props.onInput && onInputChange(e)}
      required={props.required}
      label={props.label}
      variant={props.variant}
      onChange={(e) => onValueChange(e)}
      value={props.defaultValue}
      type={props.type}
      style={props.style}
      hiddenLabel={props.hiddenLabel}
      size={props.size}
      fullWidth={props.fullWidth}
      disabled={props.disabled}
      multiline={props.multiline}
      rows={props.rows}
      InputLabelProps={props.InputLabelProps}
      helperText={props.helperText}
      error={props.error}
    />
  );
};

A_TextBox.defaultProps = {
  id: "",
  label: "",
  variant: "outlined",
  onChange: () => {},
  defaultValue: "",
  type: "text",
  style: {},
  hiddenLabel: true,
  size: "small",
  fullWidth: false,
  disabled: false,
  multiline: false,
  rows: 1,
  inputProps: {},
  InputProps: {},
  InputLabelProps: {},
  helperText: "",
  error: false,
};

A_TextBox.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string,
  variant: PropTypes.oneOf(["filled", "outlined", "standard"]),
  onChange: PropTypes.func,
  defaultValue: PropTypes.any,
  type: PropTypes.string,
  style: PropTypes.object,
  hiddenLabel: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium"]),
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  inputProps: PropTypes.object,
  InputProps: PropTypes.object,
  InputLabelProps: PropTypes.object,
  helperText: PropTypes.string,
  error: PropTypes.bool,
};

export default A_TextBox;
