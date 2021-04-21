class lingoloco {
	static context(query) {
		context(query);
		return this;
	}
	
	static translate(word, translation) {
		translate(word, translation);
		return this;
	}
	
}

let dictionary = new Map();
let contexts = new Map();
contexts.set("",dictionary);

function context(query) {
	if (query == "") {
		dictionary = context.get("");
	} 
	else {
		dictionary = new Map();
		contexts.set(query, dictionary);
	}
}

function translate(word, translation) {
	dictionary.set(word, translation);
}


const callback = function(mutationsList, observer) {

  const transform = (node) => {
	if (node.textContent === undefined || node.parentNode.nodeName == "HEAD" || node.parentNode.nodeName == "SCRIPT" || node.parentNode.nodeName == "HTML")
		return;
	
	for(let key of contexts.keys()) {
		if (key == "" || !isPartOfContext(node, key)) {
			continue;
		}
		
		dictionary = contexts.get(key);
	
		let transformedText = dictionary.get(node.textContent);
		if (transformedText !== undefined) {
			node.textContent = transformedText;
		}
		
		// Partial phrase
		var words = node.textContent.match(/((\b[^\s]+\b)((?<=\.\w).)?)/g);
		if (words) {
			for(let word of words) {
				transformedText = dictionary.get(word);
				if (transformedText !== undefined) {
					node.textContent = node.textContent.replace(word, transformedText);
				}
			}
		}
	}
  };

  for (let mutation of mutationsList) {
	if (mutation.type === "childList") {
	  for (let node of mutation.addedNodes) {

		if (node.nodeType === Node.TEXT_NODE) {
		  transform(node);
		} else if (node.childNodes.length > 0) {
		  for (let childNode of node.childNodes) {
			if (childNode.nodeType === Node.TEXT_NODE) {
			  transform(childNode);
			}
		  }
		}
	  }
	}

  }
  // clear out any changes made during this function - prevents bouncing
  observer.takeRecords();
};



function isPartOfContext(node, query) {
	let elements = document.querySelectorAll(query);
	for(let el of elements) {
		if (isDescendant(node, el)) {
			return true;
		}
	}
	return false;
}


function isDescendant(node, parent) {
	while (node = node.parentNode) { 
		if (node == parent)
			return true;
	}
	return false;
}


const config = {
  childList: true,
  subtree: true
};

let mutationObserver = new MutationObserver(callback);
let container = document.documentElement || document.body;
mutationObserver.observe(container, config);
