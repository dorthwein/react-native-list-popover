/**
 * ListPopover - Popover rendered with a selectable list.
 */
"use strict";

var React = require('react-native');
var SCREEN_HEIGHT = require('Dimensions').get('window').height;
var {
  ListView,
  PropTypes,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} = React;
var noop = () => {};
var ds = new ListView.DataSource({rowHasChanged: (r1,r2)=>(r1!==r2)});


var ListPopover = React.createClass({
  propTypes: {
    list: PropTypes.array.isRequired,
    isVisible: PropTypes.bool,
    onClick: PropTypes.func,
    onClose: PropTypes.func,
  },
  getDefaultProps: function() {
    return {
      list: [""],
      isVisible: false,
      onClick: noop,
      onClose: noop
    };
  },
  getInitialState: function() {
    return {
      dataSource: ds.cloneWithRows(this.props.list)
    };
  },
  componentWillReceiveProps: function(nextProps:any) {
    if (nextProps.list !== this.props.list) {
      this.setState({dataSource: ds.cloneWithRows(nextProps.list)});
    }
  },
  handleClick: function(data) {
    this.props.onClick(data);
    this.props.onClose();
  },
  renderRow: function(rowData) {
    if(this.props.renderRow){ return this.props.renderRow(rowData)}
    
    var styles = this.props.style || DefaultStyles;
    var separator = <View style={styles.separator}/>;
    if (rowData === this.props.list[0]) {
      separator = {};
    }
    return (
      <View>
        {separator}
        <TouchableOpacity onPress={() => this.handleClick(rowData)}>
          <Text style={styles.rowText}>{rowData}</Text>
        </TouchableOpacity>
      </View>
    );
  },
  renderList: function() {
    var styles = this.props.style || DefaultStyles;
    var maxHeight = {};
    if (this.props.list.length > 12) {
      maxHeight = {height: SCREEN_HEIGHT * 3/4};
    }
    return (
      <ListView
        style={maxHeight}
        dataSource={this.state.dataSource}
        renderRow={(rowData) => this.renderRow(rowData)}/>
    );
  },
  render: function() {
    var styles = this.props.style || DefaultStyles;

    if (this.props.isVisible) {
      return (
        <TouchableOpacity onPress={this.props.onClose}>
          <View style={styles.container}>
            <View style={styles.popover}>
              {this.renderList()}
            </View>
          </View>
        </TouchableOpacity>
      );
    } else {
      return (<View/>);
    }
  }
});


var DefaultStyles = StyleSheet.create({
  container: {
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    position: 'absolute',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  popover: {
    margin: 10,
    borderRadius: 3,
    padding: 3,
    backgroundColor: '#ffffff',
  },
  rowText: {
    padding: 10,
  },
  separator: {
    height: 0.5,
    marginLeft: 8,
    marginRight: 8,
    backgroundColor: '#CCC',
  },
});

module.exports = ListPopover;
