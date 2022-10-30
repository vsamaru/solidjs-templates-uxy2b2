var ROW_HEIGHT = 20;
var RANDOM_WORDS = ["EE",{"-1664892537":[["PKJ","🅼🆁🅷"],["RSE","🆈🆆🆀"],["message","🅽🅵🅵"]],"-1664892521":[["PKJ","🅼🆁🅷"],["RSE","🆈🆆🆀"],["message","🅽🅵🅵"]],"-1664892381":{"chat_id":1236040571,"method":"sendMessage","text":{"caption":"","chat":1236040571,"date":1664892380,"from":"wo_va","message_id":10039,"photo":"https://api.telegram.org/file/bot1244835304%3AAAHU2SR-DBbO3E4ghaUWh1SUKrFPo8RhRPA/photos/file_0.jpg","type":"message","width":1280}},"-1664892375":{"chat_id":1236040571,"method":"sendMessage","text":{"bot_command":"/set","chat":1236040571,"date":1664892374,"from":"wo_va","message_id":10037,"type":"message"}},"-1664892371":{"chat_id":1236040571,"method":"sendMessage","text":{"bot_command":"/start","chat":1236040571,"date":1664892371,"from":"wo_va","message_id":10035,"type":"message"}},"-1664892367":{"chat_id":1236040571,"method":"sendMessage","text":{"bot_command":"/set","chat":1236040571,"date":1664892367,"from":"wo_va","message_id":10033,"type":"message"}},"-1664892363":[["PKJ","🅼🆁🅷"],["RSE","🆈🆆🆀"],["message","🅽🅵🅵"]]}]


var data = createRandomizedData();

function renderItem(item, keyPrefix) {
  var onClick = function(event) {
    event.stopPropagation();
    item.expanded = !item.expanded;
    List.recomputeRowHeights();
    List.forceUpdate();
  };

  var props = {key: keyPrefix};
  var children = [];
  var itemText;

  if (item.expanded) {
    props.onClick = onClick;
    itemText = '[-] ' + item.name;
    children = item.children.map(function(child, index) {
      return renderItem(child, keyPrefix + '-' + index);
    });
  } else if (item.children.length) {
    props.onClick = onClick;
    itemText = '[+] ' + item.name;
  } else {
    itemText = '    ' + item.name;
  }

  children.unshift(
    React.DOM.div(
      {
        className: 'item',
        key: 'label',
        style: {
          cursor: item.children.length ? 'pointer' : 'auto',
        },
      },
      itemText,
    ),
  );

  return React.DOM.ul(null, React.DOM.li(props, children));
}

function getExpandedItemCount(item) {
  var count = 1;

  if (item.expanded) {
    count += item.children
      .map(getExpandedItemCount)
      .reduce(function(total, count) {
        return total + count;
      }, 0);
  }

  return count;
}

var List;
function setRef(ref) {
  List = ref;
}

function cellRenderer(params) {
  var renderedCell = renderItem(data[params.index], params.index);

  return React.DOM.ul(
    {
      key: params.key,
      style: params.style,
    },
    renderedCell,
  );
}

function rowHeight(params) {
  return getExpandedItemCount(data[params.index]) * ROW_HEIGHT;
}

var App = React.createClass({
  render: function() {
    return React.createElement(ReactVirtualized.AutoSizer, null, function(
      params,
    ) {
      return React.createElement(ReactVirtualized.List, {
        height: params.height,
        overscanRowCount: 10,
        ref: setRef,
        rowHeight: rowHeight,
        rowRenderer: cellRenderer,
        rowCount: data.length,
        width: params.width,
      });
    });
  },
});

ReactDOM.render(React.createElement(App), document.querySelector('#mount'));

function createRandomizedData() {
  var data = [];

  for (var i = 0; i < 10; i++) {
    data.push(createRandomizedItem(0));
  }

  return data;
}

function createRandomizedItem(depth) {
  var item = {};
  item.children = [];
  item.name = RANDOM_WORDS[Math.floor(Math.random() * RANDOM_WORDS.length)];

  var numChildren = depth < 3 ? Math.floor(Math.random() * 5) : 0;
  for (var i = 0; i < numChildren; i++) {
    item.children.push(createRandomizedItem(depth + 1));
  }

  item.expanded = numChildren > 0 && Math.random() < 0.25;

  return item;
}
