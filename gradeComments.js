"use strict";function _typeof(obj){"@babel/helpers - typeof";return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(obj){return typeof obj}:function(obj){return obj&&"function"==typeof Symbol&&obj.constructor===Symbol&&obj!==Symbol.prototype?"symbol":typeof obj},_typeof(obj)}function _createForOfIteratorHelper(o,allowArrayLike){var it=typeof Symbol!=="undefined"&&o[Symbol.iterator]||o["@@iterator"];if(!it){if(Array.isArray(o)||(it=_unsupportedIterableToArray(o))||allowArrayLike&&o&&typeof o.length==="number"){if(it)o=it;var i=0;var F=function F(){};return{s:F,n:function n(){if(i>=o.length)return{done:true};return{done:false,value:o[i++]}},e:function e(_e){throw _e},f:F}}throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var normalCompletion=true,didErr=false,err;return{s:function s(){it=it.call(o)},n:function n(){var step=it.next();normalCompletion=step.done;return step},e:function e(_e2){didErr=true;err=_e2},f:function f(){try{if(!normalCompletion&&it["return"]!=null)it["return"]()}finally{if(didErr)throw err}}}}function _unsupportedIterableToArray(o,minLen){if(!o)return;if(typeof o==="string")return _arrayLikeToArray(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);if(n==="Object"&&o.constructor)n=o.constructor.name;if(n==="Map"||n==="Set")return Array.from(o);if(n==="Arguments"||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _arrayLikeToArray(o,minLen)}function _arrayLikeToArray(arr,len){if(len==null||len>arr.length)len=arr.length;for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter(function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable})),keys.push.apply(keys,symbols)}return keys}function _objectSpread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{};i%2?ownKeys(Object(source),!0).forEach(function(key){_defineProperty(target,key,source[key])}):Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):ownKeys(Object(source)).forEach(function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})}return target}function _defineProperty(obj,key,value){key=_toPropertyKey(key);if(key in obj){Object.defineProperty(obj,key,{value:value,enumerable:true,configurable:true,writable:true})}else{obj[key]=value}return obj}function _toPropertyKey(arg){var key=_toPrimitive(arg,"string");return _typeof(key)==="symbol"?key:String(key)}function _toPrimitive(input,hint){if(_typeof(input)!=="object"||input===null)return input;var prim=input[Symbol.toPrimitive];if(prim!==undefined){var res=prim.call(input,hint||"default");if(_typeof(res)!=="object")return res;throw new TypeError("@@toPrimitive must return a primitive value.")}return(hint==="string"?String:Number)(input)}function grade_comments(){var stars=arguments.length>0&&arguments[0]!==undefined?arguments[0]:4;var url=new URL(document.URL);var pathname=url.pathname;if(pathname!=="/course/activity/question")return;var privateCqId=url.searchParams.get("id");var classroomId=url.searchParams.get("classId");var sessionId=url.searchParams.get("sessionId");get("".concat(API,"/course/course-detail/session-detail"),_objectSpread({},options),{sessionId:sessionId,classroomId:classroomId}).then(function(d){return d.json()}).then(function(d){var data;try{data=d.data[0]}catch(_unused){showIndicate("ERROR! Please reload EduNext!!!","#E32E10",2);return}var classroomSessionId=data.classroomSessionId;post("".concat(API,"/group/list-group"),_objectSpread({},options),{classroomSessionId:classroomSessionId}).then(function(d){return d.json()}).then(function(groups){if(groups.length<1){showIndicate("FAIL! No teammate to grade","#E32E10",2);return}var groupId=0;var userId=0;var _iterator=_createForOfIteratorHelper(groups),_step;try{for(_iterator.s();!(_step=_iterator.n()).done;){var group=_step.value;var _iterator3=_createForOfIteratorHelper(group.listStudentByGroups),_step3;try{for(_iterator3.s();!(_step3=_iterator3.n()).done;){var user=_step3.value;if(user.email==myEmail){userId=user.id;groupId=group.id;break}}}catch(err){_iterator3.e(err)}finally{_iterator3.f()}}}catch(err){_iterator.e(err)}finally{_iterator.f()}get("https://fugw-edunext.fpt.edu.vn/api/comment/get-comments",_objectSpread({},options),{cqId:privateCqId,groupId:groupId,userId:userId,classroomSessionId:classroomSessionId,outsideGroup:false}).then(function(d){return d.json()}).then(function(d){var comments=d.comments.items;var timeout=500;var availableRequestInTwoMin=5;var _iterator2=_createForOfIteratorHelper(comments),_step2;try{var _loop=function _loop(){var comment=_step2.value;var commentId=comment._id;var name=comment.writer.name;if(myId==comment.writer._id)return"continue";// showIndicate(`Pending ⭐ for ${name}`, "#7e22ce", 2);
setTimeout(function(){post("https://fugw-edunext.fpt.edu.vn/api/comment/up-votes",_objectSpread(_objectSpread({},options),{},{body:JSON.stringify({typeStar:1,cqId:privateCqId,commentId:commentId,star:stars})})).then(function(d){if(d.status==200){showIndicate("Voted ".concat(stars," \u2B50 for ").concat(name),"#059669",2)}else{showIndicate("FAIL! ".concat(name),"#E32E10",2)}})},timeout);availableRequestInTwoMin--;if(!availableRequestInTwoMin){return{v:void 0}}// timeout += 2000;
};for(_iterator2.s();!(_step2=_iterator2.n()).done;){var _ret=_loop();if(_ret==="continue")continue;if(_typeof(_ret)==="object")return _ret.v}}catch(err){_iterator2.e(err)}finally{_iterator2.f()}})})})}grade_comments();