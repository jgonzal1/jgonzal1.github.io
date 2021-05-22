# The Ultimate Unit Testing Cheat-sheet

<!-- TOC -->
* [1.1. Sinon Chai](#11-sinon-chai)
* [1.2. Chai](#12-chai)
* [1.3. Sinon](#13-sinon)
* [1.4. Mocha](#14-mocha)
* [1.5. Jest](#15-jest)
<!-- /TOC -->

Written by [yoavniran](https://github.com/yoavniran). Linted by [jgonzal1](https://github.com/jgonzal1).

<style>
    img {
        background-color: #FFFFFF;
    }
</style>

<p style="align:center">
 <img src="https://res.cloudinary.com/yoavniran/image/upload/q_auto,w_400,f_auto/v1603209048/uutcs-logo_zunwh4" alt="uutcs-logo"/>
</p>

* [Sinon Chai](#sinon-chai)
* [Chai](#chai)
* [Sinon](#sinon)
* [Mocha](#mocha)
* [Jest](#jest)

## Sinon Chai

links: [GitHub](https://github.com/domenic/sinon-chai) - [Chai plugin](http://chaijs.com/plugins/sinon-chai)

<table>
    <thead>
        <tr>
            <th>Sinon.JS property/method</th>
            <th>Sinon–Chai assertion</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>called</td>
            <td>spy.should.have.been.called</td>
        </tr>
        <tr>
            <td>callCount</td>
            <td>spy.should.have.callCount(n)</td>
        </tr>
        <tr>
            <td>calledOnce</td>
            <td>spy.should.have.been.calledOnce</td>
        </tr>
        <tr>
            <td>calledTwice</td>
            <td>spy.should.have.been.calledTwice</td>
        </tr>
        <tr>
            <td>calledThrice</td>
            <td>spy.should.have.been.calledThrice</td>
        </tr>
        <tr>
            <td>calledBefore</td>
            <td>spy1.should.have.been.calledBefore(spy2)</td>
        </tr>
        <tr>
            <td>calledAfter</td>
            <td>spy1.should.have.been.calledAfter(spy2)</td>
        </tr>
        <tr>
            <td>calledWithNew</td>
            <td>spy.should.have.been.calledWithNew</td>
        </tr>
        <tr>
            <td>alwaysCalledWithNew</td>
            <td>spy.should.always.have.been.calledWithNew</td>
        </tr>
        <tr>
            <td>calledOn</td>
            <td>spy.should.have.been.calledOn(context)</td>
        </tr>
        <tr>
            <td>alwaysCalledOn</td>
            <td>spy.should.always.have.been.calledOn(context)</td>
        </tr>
        <tr>
            <td>calledWith</td>
            <td>spy.should.have.been.calledWith(...args)</td>
        </tr>
        <tr>
            <td>alwaysCalledWith</td>
            <td>spy.should.always.have.been.calledWith(...args)</td>
        </tr>
        <tr>
            <td>calledWithExactly</td>
            <td>spy.should.have.been.calledWithExactly(...args)</td>
        </tr>
        <tr>
            <td>alwaysCalledWithExactly</td>
            <td>spy.should.always.have.been.calledWithExactly(...args)</td>
        </tr>
        <tr>
            <td>calledWithMatch</td>
            <td>spy.should.have.been.calledWithMatch(...args)</td>
        </tr>
        <tr>
            <td>alwaysCalledWithMatch</td>
            <td>spy.should.always.have.been.calledWithMatch(...args)</td>
        </tr>
        <tr>
            <td>returned</td>
            <td>spy.should.have.returned(returnVal)</td>
        </tr>
        <tr>
            <td>alwaysReturned</td>
            <td>spy.should.have.always.returned(returnVal)</td>
        </tr>
        <tr>
            <td>threw</td>
            <td>spy.should.have.thrown(errorObjOrErrorTypeStringOrNothing)</td>
        </tr>
        <tr>
            <td>alwaysThrew</td>
            <td>spy.should.have.always.thrown(errorObjOrErrorTypeStringOrNothing)</td>
        </tr>
    </tbody>
</table>

## Chai

links: [chai home](http://chaijs.com/) , [docs](http://chaijs.com/api/)

### Expect/Should (BDD)

links: [docs](http://chaijs.com/api/bdd/)

Chains:

* to
* be
* been
* is
* that
* which
* and
* has
* have
* with
* at
* of
* same

<table>
    <thead>
        <tr>
            <th>Assertions</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
<tr>
    <td>.a(type)</td>
    <td>
        <p>
            @param{ String }type<br/>
            @param{ String }message_optional_
        </p>
        <p>
            The a and an assertions are aliases that can be used either as language chains or to assert a value's type.
        </p>
        <p>
            // typeof
            <br/>
            <ul>
                <li> expect('test').to.be.a('string');</li>
                <li> expect({ foo: 'bar' }).to.be.an('object');</li>
                <li>expect(null).to.be.a('null');</li>
                <li>expect(undefined).to.be.an('undefined');</li>
            </ul>
        </p>
        <p>
            // language chain
            <ul>
                <li>expect(foo).to.be.an.instanceof(Foo);</li>
            </ul>
        </p>
    </td>
</tr>
<tr>
    <td>.above(value)</td>
    <td>
        <p>
            @param{ Number }value<br/>
            @param{ String }message_optional_
        </p>
        <p>
            Asserts that the target is greater than value.
            <ul>
                <li>expect(10).to.be.above(5);</li>
            </ul>
        </p>
        <p>
            Can also be used in conjunction with length to assert a minimum length. The benefit being a more informative error message than if the length was supplied directly.
            <ul>
                <li>expect('foo').to.have.lengthOf.above(2);</li>
                <li>expect([ 1, 2, 3 ]).to.have.lengthOf.above(2);</li>
            </ul>
        </p>
    </td>
</tr>
<tr>
        <td>.all</td>
        <td>Sets the all flag (opposite of the any flag) later used by the keys assertion.
<ul><li>expect(foo).to.have.all.keys('bar', 'baz');</li></ul>
</td>
    </tr>

<tr>
        <td>.any</td>
        <td>Sets the any flag, (opposite of the all flag) later used in the keys assertion.

<ul><li>expect(foo).to.have.any.keys('bar', 'baz');</li></ul>

</td>
    </tr>

<tr>
        <td>.arguments</td>
        <td>Asserts that the target is an arguments object.
<br/><br/>
function test () {<br/>
  expect(arguments).to.be.arguments;<br/>
}</td>
    </tr>

<tr>
    <td>.below(value)</td>
    <td>
        <p>
            @param{ Number }value<br/>
            @param{ String }message_optional_
        </p>
        <p>
            Asserts that the target is less than value.
            <ul>
                <li> expect(5).to.be.below(10);</li>
            </ul>
        </p>
        <p>
            Can also be used in conjunction with length to assert a maximum length. The benefit being a more informative error message than if the length was supplied directly.
            <ul>
                <li>expect('foo').to.have.lengthOf.below(4);</li>
                <li>expect([ 1, 2, 3 ]).to.have.lengthOf.below(4);</li>
            </ul>
        </p>
    </td>
</tr>
<tr>
    <td>.change(function)</td>
    <td>
        <p>
            @param{ String }object<br/>
            @param{ String }propertyname<br/>
            @param{ String }message_optional_<br/>
        </p>
        <p>
            Asserts that a function changes an object property
            <br/><br/>
            var obj = { val: 10 };
            <br/>
            var fn = function() { obj.val += 3 };
            <br/>
            var noChangeFn = function() { return 'foo' + 'bar'; };
            <ul>
                <li>expect(fn).to.change(obj, 'val');</li>
                <li>expect(noChangFn).to.not.change(obj, 'val')</li>
            </ul>
        </p>
    </td>
</tr>

<tr>
        <td>.closeTo(expected, delta)</td>
        <td>
    <p>
    @param{ Number }expected<br/>
    @param{ Number }delta<br/>
    @param{ String }message_optional_
</p>
<p>
Asserts that the target is equal expected, to within a +/- delta range.
</p>
<ul><li>expect(1.5).to.be.closeTo(1, 0.5);
</li></ul>

</td>
    </tr>
<tr>
        <td>.decrease(function)</td>
        <td>
<p>
    @param{ String }object<br/>
    @param{ String }propertyname<br/>
    @param{ String }message_optional_
</p>
<p>
Asserts that a function decreases an object property
</p>

var obj = { val: 10 };
<br/><br/>
var fn = function() { obj.val = 5 };
<ul><li>expect(fn).to.decrease(obj, 'val');
</li></ul>

</td>
    </tr>
<tr>
        <td>.deep</td>
        <td>Sets the deep flag, later used by the equal and property assertions.
    <br/>
<ul><li>expect(foo).to.deep.equal({ bar: 'baz' });</li>
<li>expect({ foo: { bar: { baz: 'quux' } } }).to.have.deep.property('foo.bar.baz', 'quux');</li></ul>

</td>
    </tr>
    <tr>
        <td>.empty</td>
        <td>Asserts that the target's length is 0. For arrays, it checks the length property. For objects, it gets the count of enumerable keys.
    <br/>
<ul><li>expect([]).to.be.empty;
</li><li>expect('').to.be.empty;</li>
<li>expect({}).to.be.empty;
</li></ul>
</td>
    </tr>

<tr>
    <td>.eql(value)</td>
    <td>
        <p>
            @param{ Mixed }value<br/>
               @param{ String }message_optional_
        </p>
        <p>
            Asserts that the target is deeply equal to value.
        </p>
        <ul>
            <li>expect([ 1, 2, 3 ]).to.eql([ 1, 2, 3 ]);</li>
            <li>expect({ foo: 'bar' }).to.eql({ foo: 'bar' });</li>
       </ul>
    </td>
</tr>

<tr>
    <td>.equal(value)</td>
    <td>
        <p>
            @param{ Mixed }value<br/>
            @param{ String }message_optional_
        </p>
        <p>
            Asserts that the target is strictly equal (===) to value. Alternately, if the deep flag is set, asserts that the target is deeply equal to value.
        </p>
        <ul>
            <li>expect('hello').to.equal('hello');</li>
            <li>expect(42).to.equal(42);</li>
            <li>expect(1).to.not.equal(true);</li>
            <li>expect({ foo: 'bar' }).to.not.equal({ foo: 'bar' });</li>
            <li>expect({ foo: 'bar' }).to.deep.equal({ foo: 'bar' });</li>
        </ul>
    </td>
<tr>
    <td>.exist</td>
    <td>
        Asserts that the target is neither null nor undefined.
        <p>
            var foo = 'hi',
                bar = null,
                baz;
        </p>
                <br/><br/>
        <ul>
            <li>expect(foo).to.exist;</li>
            <li>expect(bar).to.not.exist;</li>
            <li>expect(baz).to.not.exist;</li>
        </ul>
    </td>
</tr>

<tr>
    <td>.false</td>
    <td>
        Asserts that the target is false.
        <ul>
            <li>expect(false).to.be.false;</li>
            <li>expect(0).to.not.be.false;</li>
        </ul>
    </td>
</tr>

<tr>
    <td>.include(value)</td>
    <td>
        <p>
            @param{ Object | String | Number }obj<br/>
            @param{ String }message_optional_
        </p>
        <p>
            The include and contain assertions can be used as either property based language chains or as methods to assert the inclusion of an object in an array or a substring in a string. When used as language chains, they toggle the contains flag for the keys assertion.
        </p>
        <ul>
            <li>expect([1,2,3]).to.include(2);</li>
            <li>expect('foobar').to.contain('foo');</li>
            <li>expect({ foo: 'bar', hello: 'universe' }).to.include.keys('foo');</li>
        </ul>
    </td>
</tr>

<tr>
        <td>.increase(function)</td>
        <td>
    <p>
    @param{ String }object<br/>
    @param{ String }propertyname<br/>
    @param{ String }message_optional_
</p>
<p>
Asserts that a function increases an object property
</p>

var obj = { val: 10 };<br/>
var fn = function() { obj.val = 15 };</br>
<ul><li> expect(fn).to.increase(obj, 'val');</li></ul>

</td>
    </tr>
<tr>
        <td>.instanceof(constructor)</td>
        <td>
    <p>
    @param{ Constructor }constructor<br/>
    @param{ String }message_optional_
</p>
<p>
Asserts that the target is an instance of constructor.
</p>

var Tea = function (name) { this.name = name; }<br/>
  , Chai = new Tea('chai');

<ul><li>expect(Chai).to.be.an.instanceof(Tea);</li>
<li>expect([ 1, 2, 3 ]).to.be.instanceof(Array);</li></ul>

</td>
    </tr>
<tr>
        <td>.itself</td>
        <td>Sets the itself flag, later used by the respondTo assertion.
<br/>
function Foo() {}<br/>
Foo.bar = function() {}<br/>
Foo.prototype.baz = function() {}<br/>

<ul><li>expect(Foo).itself.to.respondTo('bar');</li>
<li>expect(Foo).itself.not.to.respondTo('baz');</li></ul>

</td>
    </tr>
<tr>
        <td>.keys(key1, [key2], [...])</td>
        <td>
<p>
    @param{ String... | Array | Object }keys
</p>
<p>
Asserts that the target contains any or all of the passed-in keys. Use in combination with any, all, contains, or have will affect what will pass.<br/>
When used in conjunction with any, at least one key that is passed in must exist in the target object. This is regardless whether or not the have or contain qualifiers are used. Note, either any or all should be used in the assertion. If neither are used, the assertion is defaulted to all.
<br/>
When both all and contain are used, the target object must have at least all of the passed-in keys but may have more keys not listed.
<br/>
When both all and have are used, the target object must both contain all of the passed-in keys AND the number of keys in the target object must match the number of keys passed in (in other words, a target object must have all and only all of the passed-in keys).
<br/>
</p>
<ul><li>expect({ foo: 1, bar: 2 }).to.have.any.keys('foo', 'baz');</li>
<li>expect({ foo: 1, bar: 2 }).to.have.any.keys('foo');</li>
<li>expect({ foo: 1, bar: 2 }).to.contain.any.keys('bar', 'baz');</li>
<li>expect({ foo: 1, bar: 2 }).to.contain.any.keys(['foo']);</li>
<li>expect({ foo: 1, bar: 2 }).to.contain.any.keys({'foo': 6});</li>
<li>expect({ foo: 1, bar: 2 }).to.have.all.keys(['bar', 'foo']);</li>
<li> expect({ foo: 1, bar: 2 }).to.have.all.keys({'bar': 6, 'foo': 7});</li>
<li>expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys(['bar', 'foo']);</li>
<li>expect({ foo: 1, bar: 2, baz: 3 }).to.contain.all.keys([{'bar': 6}}]);</li>
</ul>

</td>
    </tr>
<tr>
        <td>.least(value)</td>
        <td>
    <p>
    @param{ Number }value<br/>
    @param{ String }message_optional_
    </p>
<p>
    Asserts that the target is greater than or equal to value.

```html
<ul>
    <li>expect(10).to.be.at.least(10);</li>
</ul>
```

</p>
</td>
    </tr>

<tr>
        <td>.lengthOf(value)</td>
        <td>

<p>
    @param{ Number }length<br/>
    @param{ String }message_optional_<br/><br/>

    Asserts that the target's length property has the expected value.
</p>

<ul>
<li>expect([ 1, 2, 3]).to.have.lengthOf(3);</li>
<li>expect('foobar').to.have.length(6);</li>
</ul>

<p>
Can also be used as a chain precursor to a value comparison for the length property.
</p>
<ul>
<li>expect('foo').to.have.lengthOf.above(2);</li>
<li>expect([ 1, 2, 3 ]).to.have.lengthOf.above(2);</li>
<li>expect('foo').to.have.lengthOf.below(4);</li>
<li>expect('foo').to.have.lengthOf.below(4);</li>
<li>expect([ 1, 2, 3 ]).to.have.lengthOf.below(4);</li>
<li>expect('foo').to.have.lengthOf.within(2,4);</li>
<li>expect([ 1, 2, 3 ]).to.have.lengthOf.within(2,4);</li>
</ul>

</td>
    </tr>

<tr>
        <td>.match(regexp)</td>
        <td>
<p>
    @param{ RegExp }RegularExpression<br/>
    @param{ String }message_optional_
</p>
<p>
Asserts that the target matches a regular expression.
</p>

<ul><li>expect('foobar').to.match(/^foo/);</li></ul>

</td>
    </tr>

<tr>
        <td>.members(set)</td>
        <td>
    <p>
    @param{ Array }set<br/>
    @param{ String }message_optional_
</p>
<p>
Asserts that the target is a superset of set, or that the target and set have the same strictly-equal (===) members. Alternately, if the deep flag is set, set members are compared for deep equality.
</p>
<ul><li>expect([1, 2, 3]).to.include.members([3, 2]);</li>
<li>expect([1, 2, 3]).to.not.include.members([3, 2, 8]);</li>
<li>expect([4, 2]).to.have.members([2, 4]);</li>
<li>expect([5, 2]).to.not.have.members([5, 2, 1]);</li>
<li>expect([{ id: 1 }]).to.deep.include.members([{ id: 1 }]);</li></ul>

</td>
    </tr>
<tr>
        <td>.most(value)</td>
        <td>

<p>
    @param{ Number }value<br/>
    @param{ String }message_optional_
</p>
<p>
Asserts that the target is less than or equal to value.
</p>

<ul><li> expect(5).to.be.at.most(5);</li></ul>

<p>
Can also be used in conjunction with length to assert a maximum length. The benefit being a more informative error message than if the length was supplied directly.
</p>

<ul><li>expect('foo').to.have.lengthOf.at.most(4);</li>
<li> expect([ 1, 2, 3 ]).to.have.lengthOf.at.most(3);</li></ul>

</td>
    </tr>
 <tr>
            <td>.not</td>
        <td>Negates any of assertions following in the chain.

<ul><li>expect(foo).to.not.equal('bar');</li>
<li>expect(goodFn).to.not.throw(Error);</li><li>expect({ foo: 'baz' }).to.have.property('foo').and.not.equal('bar');</li></ul>

</td>
        </tr>

<tr>
        <td>.null</td>
        <td>Asserts that the target is null.
<br/>
<ul><li>expect(null).to.be.null;</li>
<li>expect(undefined).not.to.be.null;</li></ul>

</td>
    </tr>

<tr>
        <td>.ok</td>
        <td>Asserts that the target is truthy.</td>
    </tr>

<tr>
        <td>.ownProperty(name)</td>
        <td>
<p>
    @param{ String }name<br/>
    @param{ String }message_optional_
</p>
<p>
Asserts that the target has an own property name.
</p>

<ul><li> expect('test').to.have.ownProperty('length');</li></ul>

</td>
    </tr>

<tr>
        <td>.property(name, [value])</td>
        <td>
<p>
    @param{ String }name<br/>
    @param{ Mixed }value(optional)<br/>
    @param{ String }message_optional_
</p>
<p>
Asserts that the target has a property name, optionally asserting that the value of that property is strictly equal to value. If the deep flag is set, you can use dot- and bracket-notation for deep references into objects and arrays.
</p>

// simple referencing<br/>
var obj = { foo: 'bar' };<br/>

<ul><li>expect(obj).to.have.property('foo');</li><li>expect(obj).to.have.property('foo', 'bar');</li></ul>
<br/>
// deep referencing<br/>

var deepObj = {<br/>
    green: { tea: 'matcha' }<br/>
  , teas: [ 'chai', 'matcha', { tea: 'konacha' } ]<br/>
};<br/>

<ul>
<li>expect(deepObj).to.have.deep.property('green.tea', 'matcha');</li>
<li>expect(deepObj).to.have.deep.property('teas[1]', 'matcha');</li>
<li>expect(deepObj).to.have.deep.property('teas[2].tea', 'konacha');</li>
</ul>

<p>You can also use an array as the starting point of a deep.property assertion, or traverse nested arrays.</p>

var arr = [<br/>
    [ 'chai', 'matcha', 'konacha' ]<br/>
  , [ { tea: 'chai' }<br/>
    , { tea: 'matcha' }<br/>
    , { tea: 'konacha' } ]<br/>
];<br/>

<ul>
<li>expect(arr).to.have.deep.property('[0][1]', 'matcha');</li>
<li>expect(arr).to.have.deep.property('[1][2].tea', 'konacha');</li>
</ul>

<p>
Furthermore, property changes the subject of the assertion to be the value of that property from the original object. This permits for further chainable assertions on that property.
</p>

<ul><li>expect(obj).to.have.property('foo').that.is.a('string');</li>
<li>expect(deepObj).to.have.property('green').that.is.an('object').that.deep.equals({ tea: 'matcha' });</li>
<li>expect(deepObj).to.have.property('teas').that.is.an('array').with.deep.property('[2]').that.deep.equals({ tea: 'konacha' });</li></ul>

</td>
    </tr>

<tr>
        <td>.respondTo(method)</td>
        <td>
<p>
    @param{ String }method<br/>
    @param{ String }message_optional_
</p>

<p>
Asserts that the object or class target will respond to a method.
</p>
Klass.prototype.bar = function(){};<br/>

<ul><li>expect(Klass).to.respondTo('bar');</li>
<li>expect(obj).to.respondTo('bar');</li></ul>

<p>
To check if a constructor will respond to a static function, set the itself flag.
</p>

Klass.baz = function(){};<br/>

<ul><li>expect(Klass).itself.to.respondTo('baz');</li></ul>

</td>
    </tr>
<tr>
        <td>.satisfy(method)</td>
        <td>
    <p>
    @param{ Function }matcher<br/>
    @param{ String }message_optional_
</p>
<p>
Asserts that the target passes a given truth test.
</p>

<ul><li>expect(1).to.satisfy(function(num) { return num > 0; });</li></ul>

</td>
    </tr>
<tr>
        <td>.string(string)</td>
        <td>
<p>
    @param{ String }string<br/>
    @param{ String }message_optional_
</p>
<p>
Asserts that the string target contains another string.
</p>
<ul><li>expect('foobar').to.have.string('bar');</li></ul>

</td>
    </tr>

<tr>
        <td>.throw(constructor)</td>
        <td>
<p>
    @param{ ErrorConstructor }constructor<br/>
    @param{ String | RegExp }expectederror message<br/>
    @param{ String }message_optional_<br/>
    @see: [https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Error#Error_types]()
</p>
Asserts that the function target will throw a specific error, or specific type of error (as determined using instanceof), optionally with a RegExp or string inclusion test for the error's message.
<br/><br/>
var err = new ReferenceError('This is a bad function.');
<br/></br>
var fn = function () { throw err; }
<br/>
<ul>
<li>expect(fn).to.throw(ReferenceError);</li>
<li> expect(fn).to.throw(Error);</li>
<li>expect(fn).to.throw(/bad function/);</li>
<li>expect(fn).to.not.throw('good function');</li>
<li>expect(fn).to.throw(ReferenceError, /bad function/);</li>
<li>expect(fn).to.throw(err);</li>
<li>expect(fn).to.not.throw(new RangeError('Out of range.'));</li>
</ul>
Please note that when a throw expectation is negated, it will check each parameter independently, starting with error constructor type. The appropriate way to check for the existence of a type of error but for a message that does not match is to use and.

<ul>
<li>expect(fn).to.throw(ReferenceError)
   .and.not.throw(/good function/);
</li>
</ul>
</td>
    </tr>
<tr>
        <td>.true</td>
        <td>Asserts that the target is true.

<ul><li>expect(true).to.be.true;</li>
<li>expect(1).to.not.be.true;</li></ul>

</td>
    </tr>
<tr>
        <td>.undefined</td>
        <td>Asserts that the target is undefined.

<ul><li>expect(undefined).to.be.undefined;</li>
<li>expect(null).to.not.be.undefined;</li></ul>

</td>
    </tr>

<tr>
        <td>.within(start, finish)</td>
        <td>
    <p>
    @param{ Number }startlowerbound inclusive<br/>
    @param{ Number }finishupperbound inclusive<br/>
    @param{ String }message_optional_
</p>
Asserts that the target is within a range.

<ul><li> expect(7).to.be.within(5,10);</li></ul>
<br/>

Can also be used in conjunction with length to assert a length range. The benefit being a more informative error message than if the length was supplied directly.

<ul><li>expect('foo').to.have.lengthOf.within(2,4);</li>
<li>expect([ 1, 2, 3 ]).to.have.lengthOf.within(2,4);</li></ul>

</td>
    </tr>
</tbody>
</table>

## Sinon

links: [sinon home](http://sinonjs.org/) , [docs](http://sinonjs.org/docs/) , [code](https://github.com/cjohansen/Sinon.JS)

### Spy

```js
var spy = sinon.spy();
```

Creates an anonymous function that records arguments, this value, exceptions and return values for all calls.

```js
var spy = sinon.spy(myFunc);
```

Spies on the provided function

```js
var spy = sinon.spy(object, "method");
```

Creates a spy for object.method and replaces the original method with the spy. The spy acts exactly like the original method in all cases. The original method can be restored by calling object.method.restore(). The returned spy is the function object which replaced the original method. spy === object.method.

<table>
    <thead>
        <tr>
            <th>Spy method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>spy.callCount</td>
        <td>The number of recorded calls.</td>
        </tr>
    <tr>
        <td>spy.called</td>
        <td>true if the spy was called at least once</td>
    </tr>
    <tr>
        <td>spy.calledOnce</td>
        <td>true if spy was called exactly once</td>
    </tr>
    <tr>
        <td>spy.calledTwice</td>
        <td>true if the spy was called exactly twice</td>
    </tr>
    <tr>
        <td>spy.calledThrice</td>
        <td>true if the spy was called exactly thrice</td>
    </tr>
    <tr>
        <td>spy.firstCall</td>
        <td>The first call</td>
    </tr>
    <tr>
        <td>spy.secondCall</td>
        <td>The second call</td>
    </tr>
    <tr>
        <td>spy.thirdCall</td>
        <td>The third call</td>
    </tr>
    <tr>
        <td>spy.lastCall</td>
        <td>The last call</td>
    </tr>
    <tr>
        <td>spy.calledBefore(anotherSpy);</td>
        <td>Returns true if the spy was called before anotherSpy</td>
    </tr>
    <tr>
        <td>spy.calledAfter(anotherSpy);</td>
        <td>Returns true if the spy was called after anotherSpy</td>
    </tr>
    <tr>
        <td>spy.calledOn(obj);</td>
        <td>Returns true if the spy was called at least once with obj as this</td>
    </tr>
    <tr>
        <td>spy.alwaysCalledOn(obj);</td>
        <td>Returns true if the spy was always called with obj as this.</td>
    </tr>
    <tr>
        <td>spy.calledWith(arg1, arg2, ...);</td>
        <td>Returns true if spy was called at least once with the provided arguments. Can be used for partial matching, Sinon only checks the provided arguments against actual arguments, so a call that received the provided arguments (in the same spots) and possibly others as well will return true.</td>
    </tr>
<tr>
        <td>spy.alwaysCalledWith(arg1, arg2, ...);</td>
        <td>Returns true if spy was always called with the provided arguments (and possibly others).</td>
    </tr>
<tr>
        <td>spy.calledWithExactly(arg1, arg2, ...);</td>
        <td>Returns true if spy was called at least once with the provided arguments and no others.</td>
    </tr>
<tr>
        <td>spy.alwaysCalledWithExactly(arg1, arg2, ...);</td>
        <td>Returns true if spy was always called with the exact provided arguments.</td>
    </tr>
<tr>
        <td>spy.calledWithMatch(arg1, arg2, ...);</td>
        <td>Returns true if spy was called with matching arguments (and possibly others). This behaves the same as spy.calledWith(sinon.match(arg1), sinon.match(arg2), ...).</td>
    </tr>
<tr>
        <td>spy.alwaysCalledWithMatch(arg1, arg2, ...);</td>
        <td>Returns true if spy was always called with matching arguments (and possibly others). This behaves the same as spy.alwaysCalledWith(sinon.match(arg1), sinon.match(arg2), ...).</td>
    </tr>
<tr>
        <td>spy.calledWithNew();</td>
        <td>Returns true if spy/stub was called the new operator. Beware that this is inferred based on the value of the this object and the spy function’s prototype, so it may give false positives if you actively return the right kind of object.</td>
    </tr>
<tr>
        <td>spy.neverCalledWith(arg1, arg2, ...);</td>
        <td>Returns true if the spy/stub was never called with the provided arguments.</td>
    </tr>
<tr>
        <td>spy.neverCalledWithMatch(arg1, arg2, ...);</td>
        <td>Returns true if the spy/stub was never called with matching arguments. This behaves the same as spy.neverCalledWith(sinon.match(arg1), sinon.match(arg2), ...).</td>
    </tr>
<tr>
        <td>spy.threw();</td>
        <td>Returns true if spy threw an exception at least once.</td>
    </tr>
<tr>
        <td>spy.threw("TypeError");</td>
        <td>Returns true if spy threw an exception of the provided type at least once.</td>
    </tr>
<tr>
        <td>spy.threw(obj);</td>
        <td>Returns true if spy threw the provided exception object at least once.</td>
    </tr>
<tr>
        <td>spy.alwaysThrew();</td>
        <td>Returns true if spy always threw an exception.</td>
    </tr>
<tr>
        <td>spy.alwaysThrew("TypeError");</td>
        <td>Returns true if spy always threw an exception of the provided type.</td>
    </tr>
<tr>
        <td>spy.alwaysThrew(obj);</td>
        <td>Returns true if spy always threw the provided exception object.</td>
    </tr>
<tr>
        <td>spy.returned(obj);</td>
        <td>Returns true if spy returned the provided value at least once. Uses deep comparison for objects and arrays. Use spy.returned(sinon.match.same(obj)) for strict comparison (see <a href="#sinonMatchers">Matchers</a>). </td>
    </tr>
<tr>
        <td>spy.alwaysReturned(obj);</td>
        <td>Returns true if spy always returned the provided value.</td>
    </tr>
<tr>
        <td>var spyCall = spy.getCall(n);</td>
        <td>Returns the nth <a href="#spycall">call</a>). Accessing individual calls helps with more detailed behavior verification when the spy is called more than once. Example:
<br/><br/>
sinon.spy(jQuery, "ajax");
<br/>
jQuery.ajax("/stuffs");
<br/>
var spyCall = jQuery.ajax.getCall(0);
<br/>
assertEquals("/stuffs", spyCall.args[0]);</td>
    </tr>
<tr>
        <td>spy.thisValues</td>
        <td>Array of this objects, spy.thisValues[0] is the this object for the first call.</td>
    </tr>
<tr>
        <td>spy.args</td>
        <td>Array of arguments received, spy.args[0] is an array of arguments received in the first call.</td>
    </tr>
<tr>
        <td>spy.exceptions</td>
        <td>Array of exception objects thrown, spy.exceptions[0] is the exception thrown by the first call. If the call did not throw an error, the value at the call’s location in .exceptions will be ‘undefined’.</td>
    </tr>
<tr>
        <td>spy.returnValues</td>
        <td>Array of return values, spy.returnValues[0] is the return value of the first call. If the call did not explicitly return a value, the value at the call’s location in .returnValues will be ‘undefined’.</td>
    </tr>
<tr>
        <td>spy.reset()</td>
        <td>Resets the state of a spy.</td>
    </tr>
<tr>
        <td>spy.printf(format string", [arg1, arg2, ...])`</td>
        <td>Returns the passed format string with the following replacements performed:

<br/><ul>
<li>%n: the name of the spy (“spy” by default)</li>
<li>%c: the number of times the spy was called, in words (“once”, “twice”, etc.)</li>
<li>%C: a list of string representations of the calls to the spy, with each call prefixed by a newline and four spaces</li>
<li>%t: a comma-delimited list of this values the spy was called on</li>
<li>%<var>n</var>: the formatted value of the nth argument passed to printf</li>
<li> %*: a comma-delimited list of the (non-format string) arguments passed to printf</li>

</td>
    </tr>
</tbody>
</table>

#### Individual spy calls

<table>
    <thead>
        <tr>
            <th>Spy method</th>
            <th>Description</th>
        </tr>
    </thead>

<tbody>
        <tr>
            <td>var spyCall = spy.getCall(n)</td>
            <td>Returns the nth [call](#spycall). Accessing individual calls helps with more detailed behavior verification when the spy is called more than once. Example: </td>
        </tr>
<tr>
            <td>spyCall.calledOn(obj);</td>
            <td>Returns true if obj was this for this call.</td>
        </tr>
<tr>
            <td>spyCall.calledWith(arg1, arg2, ...);</td>
            <td>Returns true if call received provided arguments (and possibly others).</td>
        </tr>
<tr>
            <td>spyCall.calledWithExactly(arg1, arg2, ...);</td>
            <td>Returns true if call received provided arguments and no others.</td>
        </tr>
<tr>
            <td>spyCall.calledWithMatch(arg1, arg2, ...);</td>
            <td>Returns true if call received matching arguments (and possibly others). This behaves the same as spyCall.calledWith(sinon.match(arg1), sinon.match(arg2), ...).</td>
        </tr>
<tr>
            <td>spyCall.notCalledWith(arg1, arg2, ...);</td>
            <td>Returns true if call did not receive provided arguments.</td>
        </tr>
<tr>
            <td>spyCall.notCalledWithMatch(arg1, arg2, ...);</td>
            <td>    Returns true if call did not receive matching arguments. This behaves the same as spyCall.notCalledWith(sinon.match(arg1), sinon.match(arg2), ...).</td>
        </tr>
<tr>
            <td>spyCall.threw();</td>
            <td>Returns true if call threw an exception.</td>
        </tr>
<tr>
            <td>spyCall.threw(TypeError");</td>
            <td>Returns true if call threw exception of provided type.</td>
        </tr>
<tr>
            <td>spyCall.threw(obj);</td>
            <td>Returns true if call threw provided exception object.</td>
        </tr>

<tr>
            <td>spyCall.thisValue</td>
            <td>The call’s this value.</td>
        </tr>
<tr>
            <td>spyCall.args</td>
            <td>Array of received arguments.</td>
        </tr>
<tr>
            <td>spyCall.exception</td>
            <td>Exception thrown, if any.</td>
        </tr>
<tr>
            <td>spyCall.returnValue</td>
            <td>Return value.</td>
        </tr>
</tbody>
</table>

----

### Stub

link: [stubs doc](http://sinonjs.org/docs/#stubs)

```js
var stub = sinon.stub();
```

Creates an anonymous stub function.

```js
var stub = sinon.stub(object, "method");
```

Replaces object.method with a stub function. The original function can be restored by calling object.method.restore(); (or stub.restore();). An exception is thrown if the property is not already a function, to help avoid typos when stubbing methods.

```js
var stuv = sinon.stub(object, "method").callsFake(fn)
// deprecated (since v3.0.0): var stub = sinon.stub(object, "method", func);
```

Replaces object.method with a func, wrapped in a spy. As usual, object.method.restore(); can be used to restore the original method.

```js
var stub = sinon.stub(obj);
```

Stubs all the object’s methods. Note that it’s usually better practice to stub individual methods, particularly on objects that you don’t understand or control all the methods for (e.g. library dependencies). Stubbing individual methods tests intent more precisely and is less susceptible to unexpected behavior as the object’s code evolves.
    If you want to create a stub object of MyConstructor, but don’t want the constructor to be invoked, use this utility function.

``` js
var stub = sinon.createStubInstance(MyConstructor)
```

<table>
    <thead>
        <tr>
            <th>Stub method</th>
            <th>Description</th>
        </tr>
    </thead>

<tbody>
        <tr>
            <td>stub.withArgs(arg1[, arg2, ...]);</td>
            <td>Stubs the method only for the provided arguments. This is useful to be more expressive in your assertions, where you can access the spy with the same call. It is also useful to create a stub that can act differently in response to different arguments.</td>
        </tr>
    <tr>
        <td>stub.onCall(n);</td>
        <td>Defines the behavior of the stub on the nth call. Useful for testing sequential interactions.</td>
    </tr>
    <tr>
        <td>stub.onFirstCall();</td>
        <td>Alias for stub.onCall(0);</td>
    </tr>
    <tr>
        <td>stub.onSecondCall();</td>
        <td>Alias for stub.onCall(1);</td>
    </tr>
    <tr>
        <td>stub.onThirdCall();</td>
        <td>Alias for stub.onCall(2);</td>
    </tr>
    <tr>
        <td>stub.returns(obj);</td>
        <td>Makes the stub return the provided value.</td>
    </tr>
    <tr>
        <td>stub.returnsArg(index);</td>
        <td>Causes the stub to return the argument at the provided index. stub.returnsArg(0); causes the stub to return the first argument.</td>
    </tr>
    <tr>
        <td>stub.returnsThis();</td>
        <td>Causes the stub to return its this value. Useful for stubbing jQuery-style fluent APIs.</td>
    </tr>
    <tr>
        <td>stub.resolves(value);</td>
        <td>
            Causes the stub to return a Promise which resolves to the provided value.
            When constructing the Promise, sinon uses the Promise.resolve method. You are responsible for providing a polyfill in environments which do not provide Promise. The Promise library can be overwritten using the usingPromise method.
            <br/><br/>
            Since sinon@2.0.0
        </td>
    </tr>
    <tr>
        <td>stub.resolvesArg(index);</td>
        <td>
            Causes the stub to return a Promise which resolves to the argument at the provided index.
            stub.resolvesArg(0); causes the stub to return a Promise which resolves to the first argument.
            If the argument at the provided index is not available, a TypeError will be thrown.
            <br/><br/>
            Since sinon@6.1.1
        </td>
    </tr>
    <tr>
        <td>stub.throws();</td>
        <td>Causes the stub to throw an exception (Error).</td>
    </tr>
    <tr>
        <td>stub.throws("TypeError");</td>
        <td>Causes the stub to throw an exception of the provided type.</td>
    </tr>
    <tr>
        <td>stub.throws(obj);</td>
        <td>Causes the stub to throw the provided exception object.</td>
    </tr>
    <tr>
        <td>stub.callsArg(index);</td>
        <td>Causes the stub to call the argument at the provided index as a callback function. stub.callsArg(0); causes the stub to call the first argument as a callback.</td>
    </tr>
    <tr>
        <td>stub.callsArgOn(index, context);</td>
        <td>Like above but with an additional parameter to pass the this context.</td>
    </tr>
    <tr>
        <td>stub.callsArgWith(index, arg1, arg2, ...);</td>
        <td>Like callsArg, but with arguments to pass to the callback.</td>
    </tr>
    <tr>
        <td>stub.callsArgOnWith(index, context, arg1, arg2, ...);</td>
        <td>Like above but with an additional parameter to pass the this context.</td>
    </tr>
    <tr>
        <td>stub.yields([arg1, arg2, ...])</td>
        <td>Almost like callsArg. Causes the stub to call the first callback it receives with the provided arguments (if any). If a method accepts more than one callback, you need to use callsArg to have the stub invoke other callbacks than the first one.</td>
    </tr>
    <tr>
        <td>stub.yieldsOn(context, [arg1, arg2, ...])</td>
        <td>Like above but with an additional parameter to pass the this context.</td>
    </tr>
    <tr>
        <td>stub.yieldsTo(property, [arg1, arg2, ...])</td>
        <td>Causes the spy to invoke a callback passed as a property of an object to the spy. Like yields, yieldsTo grabs the first matching argument, finds the callback and calls it with the (optional) arguments.</td>
    </tr>
    <tr>
        <td>stub.yieldsToOn(property, context, [arg1, arg2, ...])</td>
        <td>Like above but with an additional parameter to pass the this context.</td>
    </tr>
    <tr>
        <td>spy.yield([arg1, arg2, ...]) </td>
        <td>Invoke callbacks passed to the spy with the given arguments. If the spy was never called with a function argument, yield throws an error. Also aliased as invokeCallback. </td>
</tr>
    <tr>
        <td>spy.yieldTo(callback, [arg1, arg2, ...])</td>
        <td>Invokes callbacks passed as a property of an object to the spy. Like yield, yieldTo grabs the first matching argument, finds the callback and calls it with the (optional) arguments.</td>
    </tr>
    <tr>
        <td>spy.callArg(argNum)</td>
        <td>Like yield, but with an explicit argument number specifying which callback to call. Useful if a function is called with more than one callback, and simply calling the first callback is not desired.</td>
    </tr>
    <tr>
        <td>spy.callArgWith(argNum, [arg1, arg2, ...])</td>
        <td> Like `callArg`, but with arguments.</td>
    </tr>
    <tr>
        <td>stub.callsArgAsync(index);</td>
        <td>Same as their corresponding non-Async counterparts, but with callback being deferred (executed not immediately but after short timeout and in another “thread”)</td>
    </tr>
    <tr>
        <td>stub.callsArgOnAsync(index, context);</td>
        <td></td>
    </tr>
    <tr>
        <td>stub.callsArgWithAsync(index, arg1, arg2, ...);</td>
        <td></td>
    </tr>
    <tr>
        <td>stub.callsArgOnWithAsync(index, context, arg1, arg2, ...);</td>
        <td></td>
    </tr>
    <tr>
        <td>stub.yieldsAsync([arg1, arg2, ...])</td>
        <td></td>
    </tr>
    <tr>
        <td>stub.yieldsOnAsync(context, [arg1, arg2, ...])</td>
        <td></td>
    </tr>
    <tr>
        <td>stub.yieldsToAsync(property, [arg1, arg2, ...])</td>
        <td></td>
    </tr>
    <tr>
        <td>stub.yieldsToOnAsync(property, context, [arg1, arg2, ...])</td>
        <td>Same as their corresponding non-Async counterparts, but with callback being deferred (executed not immediately but after short timeout and in another “thread”)</td>
    </tr>
</tbody>
</table>

### Mock

link: [docs](http://sinonjs.org/docs/#mocks)

```js
var mock = sinon.mock(obj);
```

Creates a mock for the provided object. Does not change the object, but returns a mock object to set expectations on the object’s methods.

```js
var expectation = mock.expects("method");
```

Overrides obj.method with a mock function and returns it. See expectations below.

```js
mock.restore();
```

Restores all mocked methods.

```js
mock.verify();
```

Verifies all expectations on the mock. If any expectation is not satisfied, an exception is thrown. Also restores the mocked methods.

<table>
    <thead>
        <tr>
            <th>Expectation method</th>
            <th>Description</th>
        </tr>
    </thead>

<tbody>
    <tr>
        <td>var expectation = sinon.expectation.create([methodName]);</td>
        <td>Creates an expectation without a mock object, basically an anonymous mock function. Method name is optional and is used in exception messages to make them more readable.</td>
    </tr>
<tr>
        <td>var expectation = sinon.mock();</td>
        <td>The same as the above.</td>
    </tr>
<tr>
        <td>expectation.atLeast(number);</td>
        <td>Specify the minimum amount of calls expected.</td>
    </tr>
<tr>
        <td>expectation.atMost(number);</td>
        <td>Specify the maximum amount of calls expected.</td>
    </tr>
<tr>
        <td>expectation.never();</td>
        <td>Expect the method to never be called.</td>
    </tr>
<tr>
        <td>expectation.once();</td>
        <td>Expect the method to be called exactly once.</td>
    </tr>
<tr>
        <td>expectation.twice();</td>
        <td>Expect the method to be called exactly twice.</td>
    </tr>
<tr>
        <td>expectation.thrice();</td>
        <td>Expect the method to be called exactly thrice.</td>
    </tr>
<tr>
        <td>expectation.exactly(number);</td>
        <td>Expect the method to be called exactly number times.</td>
    </tr>
<tr>
        <td>expectation.withArgs(arg1, arg2, ...);</td>
        <td>Expect the method to be called with the provided arguments and possibly others.</td>
    </tr>
<tr>
        <td>expectation.withExactArgs(arg1, arg2, ...);</td>
        <td>Expect the method to be called with the provided arguments and no others.</td>
    </tr>
<tr>
        <td>expectation.on(obj);</td>
        <td>Expect the method to be called with obj as this.</td>
    </tr>
<tr>
        <td>expectation.verify();</td>
        <td>Verifies the expectation and throws an exception if it’s not met.</td>
    </tr>
</tbody>
</table>

### Matchers

<table>
    <thead>
        <tr>
            <th>Matchers method</th>
            <th>Description</th>
        </tr>
    </thead>

<tbody>
<tr>
        <td>sinon.match(number)</td>
        <td>Requires the value to be == to the given number.
</td>
    </tr>
<tr>
        <td>sinon.match(string)</td>
        <td>Requires the value to be a string and have the expectation as a substring.</td>
    </tr>
<tr>
        <td>sinon.match(regexp)</td>
        <td>Requires the value to be a string and match the given regular expression.</td>
    </tr>
<tr>
        <td>sinon.match(object)</td>
        <td>Requires the value to be not null or undefined and have at least the same properties as expectation. This supports nested matchers.</td>
    </tr>
<tr>
        <td>sinon.match(function)</td>
        <td>See [custom matchers](#sinonCustomMatchers)</td>
    </tr>
<tr>
        <td>sinon.match.any</td>
        <td>Matches anything.</td>
    </tr>
<tr>
        <td>sinon.match.defined</td>
        <td>Requires the value to be defined.</td>
    </tr>
<tr>
        <td>sinon.match.truthy</td>
        <td>Requires the value to be truthy.</td>
    </tr>
<tr>
        <td>sinon.match.falsy</td>
        <td>Requires the value to be falsy.</td>
    </tr>
<tr>
        <td>sinon.match.bool</td>
        <td>Requires the value to be a boolean.</td>
    </tr>
<tr>
        <td>sinon.match.number</td>
        <td>Requires the value to be a number.</td>
    </tr>
<tr>
        <td>sinon.match.string</td>
        <td>Requires the value to be a string.</td>
    </tr>
<tr>
        <td>sinon.match.object</td>
        <td>Requires the value to be an object.</td>
    </tr>
<tr>
        <td>sinon.match.func</td>
        <td>Requires the value to be a function.</td>
    </tr>
<tr>
        <td>sinon.match.array</td>
        <td>Requires the value to be an array.</td>
    </tr>
<tr>
        <td>sinon.match.regexp</td>
        <td>Requires the value to be a regular expression.</td>
    </tr>
<tr>
        <td>sinon.match.date</td>
        <td>Requires the value to be a date object.</td>
    </tr>
<tr>
        <td>sinon.match.same(ref)</td>
        <td>Requires the value to strictly equal ref.</td>
    </tr>
<tr>
        <td>sinon.match.typeOf(type)</td>
        <td>Requires the value to be of the given type, where type can be one of "undefined", "null", "boolean", "number", "string", "object", "function", "array", "regexp" or "date".</td>
    </tr>
<tr>
        <td>sinon.match.instanceOf(type)</td>
        <td>Requires the value to be an instance of the given type.</td>
    </tr>
<tr>
        <td>sinon.match.has(property[, expectation])</td>
        <td>Requires the value to define the given property. The property might be inherited via the prototype chain. If the optional expectation is given, the value of the property is deeply compared with the expectation. The expectation can be another matcher.</td>
    </tr>
<tr>
        <td>sinon.match.hasOwn(property[, expectation])</td>
        <td>Same as sinon.match.has but the property must be defined by the value itself. Inherited properties are ignored.</td>
    </tr>
</tbody>
</table>

#### Combining matchers

All matchers implement `and` and `or`. This allows to logically combine mutliple matchers. The result is a new matchers that requires both (and) or one of the matchers (or) to return true.

```js
var stringOrNumber = sinon.match.string.or(sinon.match.number);
var bookWithPages = sinon.match.instanceOf(Book).and(sinon.match.has("pages"));
```

<a name="sinonCustomMatchers">&nbsp;</a>

#### Custom matchers

Custom matchers are created with the `sinon.match` factory which takes a test function and an optional message. The test function takes a value as the only argument, returns `true` if the value matches the expectation and `false` otherwise. The message string is used to generate the error message in case the value does not match the expectation.

```js
var trueIsh = sinon.match(function (value) {
    return !!value;
}, "trueIsh");
```

## Mocha

links: [home](http://mochajs.org/)

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
<tbody>
<tr>
        <td>Synchronous code</td>
<td>

```js
describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present', function(){ 
            [1,2,3].indexOf(5).should.equal(-1); 
            [1,2,3].indexOf(0).should.equal(-1);
        })
    })
})
```

</td>
    </tr>
<tr>
        <td>Asynchronous code</td>
        <td>

```js
describe('User', function(){
    describe('#save()', function(){
        it('should save without error', function(done){
            var user = new User('Luna');
            user.save(function(err){
                if (err) throw err;
                done();
            });
        })
    })
})
```

</td>
    </tr>
<tr>
    <td>Done with Error </td>
    <td>

```js
describe('User', function(){
    describe('#save()', function(){
        it('should save without error', function(done){
            var user = new User('Luna');
            user.save(done);
        })
    })
})
```

</td>
    </tr>
<tr>
        <td>hooks</td>
        <td>

```js
describe('hooks',
    /**
    * Each hook also accepting done as first parameter to support async methods
    */
    function() {
        before(function() {
            // runs before all tests in this block
        })
        after(function(){
            // runs after all tests in this block
        })
        beforeEach(function(){
            // runs before each test in this block
        })
        afterEach(function(){
            // runs after each test in this block
        })
        // test cases
    }
)
```

</td>
    </tr>
<tr>
        <td>Pending tests</td>
        <td>

```js
describe('Array', function(){
    describe('#indexOf()', function(){
        it('should return -1 when the value is not present');
    })
})
```

</td>
    </tr>
<tr>
        <td>Exclusive tests</td>
        <td>

```js
describe('Array', function(){
    describe.only('#indexOf()', function(){
        ...
    })
})
// Or a specific test-case:
describe('Array', function(){
    describe('#indexOf()', function(){
        it.only('should return -1 unless present', function(){
        })
        it('should return the index when present', function(){
        })
    })
})
```

</td>
    </tr>
<tr>
        <td>Inclusive tests</td>
        <td>

```js
describe('Array', function(){
    describe.skip('#indexOf()', function(){
        ...
    })
})
// Or a specific test-case:
describe('Array', function(){
    describe('#indexOf()', function(){
        it.skip('should return -1 unless present', function(){
        })
        it('should return the index when present', function(){
        })
    })
})
```

</td>
</tr>
</tbody>
</table>

### Flags

Usage:

> mocha [debug] [options] [files]

<table>
    <thead>
        <tr>
            <th>Flag</th>
            <th>Description</th>
        </tr>
    </thead>

<tbody>

<tr>
        <td>-w, --watch</td>
        <td>Executes tests on changes to JavaScript in the CWD, and once initially.</td>
    </tr>

<tr>
        <td>--compilers</td>
        <td>coffee-script is no longer supported out of the box. CS and similar transpilers may be used by mapping the file extensions (for use with --watch) and the module name. For example --compilers coffee:coffee-script with CoffeeScript 1.6- or --compilers coffee:coffee-script/register with CoffeeScript 1.7+.</td>
    </tr>

<tr>
        <td>-b, --bail</td>
        <td>Only interested in the first exception? use --bail !</td>
    </tr>

<tr>
        <td>-d, --debug</td>
        <td>Enables node's debugger support, this executes your script(s) with node debug <file ...> allowing you to step through code and break with the debugger statement. Note the difference between mocha debug and mocha --debug: mocha debug will fire up node's built-in debug client, mocha --debug will allow you to use a different interface — such as the Blink Developer Tools.</td>
    </tr>

<tr>
        <td>--globals [names]</td>
        <td>Accepts a comma-delimited list of accepted global variable names. For example, suppose your app deliberately exposes a global named app and YUI, you may want to add --globals app,YUI. It also accepts wildcards. You could do --globals '*bar' and it would match foobar, barbar, etc. You can also simply pass in '*' to ignore all globals.</td>
    </tr>

<tr>
        <td>--check-leaks</td>
        <td>By default Mocha will not check for global variables leaked while running tests, to enable this pass --check-leaks, to specify globals that are acceptable use --globals, for example --globals jQuery,MyLib.</td>
    </tr>

<tr>
        <td>-r, --require [name]</td>
        <td>The --require option is useful for libraries such as should.js, so you may simply --require should instead of manually invoking require('should') within each test file. Note that this works well for should as it augments Object.prototype, however if you wish to access a module's exports you will have to require them, for example var should = require('should'). Furthermore, it can be used with relative paths, e.g. --require ./test/helper.js</td>
    </tr>

<tr>
        <td>-u, --ui [name]</td>
        <td>The --ui option lets you specify the interface to use, defaulting to "bdd".</td>
    </tr>

<tr>
        <td>-R, --reporter [name]</td>
        <td>The --reporter option allows you to specify the reporter that will be used, defaulting to "dot". This flag may also be used to utilize third-party reporters. For example if you npm install mocha-lcov-reporter you may then do --reporter mocha-lcov-reporter.</td>
    </tr>

<tr>
        <td>-t, --timeout [ms]</td>
        <td>Specifies the test-case timeout, defaulting to 2 seconds. To override you may pass the timeout in milliseconds, or a value with the s suffix, ex: --timeout 2s or --timeout 2000 would be equivalent.</td>
    </tr>

<tr>
        <td>-s, --slow [ms]</td>
        <td>Specify the "slow" test threshold, defaulting to 75ms. Mocha uses this to highlight test-cases that are taking too long.
</td>
    </tr>

<tr>
        <td>-g, --grep [pattern]</td>
        <td>The --grep option when specified will trigger mocha to only run tests matching the given pattern which is internally compiled to a RegExp.
</td>
</tr>
</tbody>
</table>

## Jest

links: [home](https://jestjs.io/en/) [docs](https://jestjs.io/docs/en/api)

### Globals

[docs](https://jestjs.io/docs/en/api)

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                afterAll(fn, timeout)
            </td>
            <td>
                Runs a function after all the tests in this file have completed. If the function returns a promise or is a generator, Jest waits for that promise to resolve before continuing.
                Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before aborting. Note: The default timeout is 5 seconds.
                This is often useful if you want to clean up some global setup state that is shared across tests.
            </td>
        </tr>
        <tr>
                    <td>
                       afterEach(fn, timeout)
                    </td>
                    <td>
                        Runs a function after each one of the tests in this file completes. If the function returns a promise or is a generator, Jest waits for that promise to resolve before continuing.
                        Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before aborting. Note: The default timeout is 5 seconds.
                        This is often useful if you want to clean up some temporary state that is created by each test.
                    </td>
                </tr>
        <tr>
            <td>
                beforeAll(fn, timeout)
            </td>
            <td>
                Runs a function before any of the tests in this file run. If the function returns a promise or is a generator, Jest waits for that promise to resolve before running tests.
                Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before aborting. Note: The default timeout is 5 seconds.
                This is often useful if you want to set up some global state that will be used by many tests.
            </td>
        </tr>
        <tr>
            <td>
                beforeEach(fn, timeout)
            </td>
            <td>
                Runs a function before each of the tests in this file runs. If the function returns a promise or is a generator, Jest waits for that promise to resolve before running the test.
                Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before aborting. Note: The default timeout is 5 seconds.
                This is often useful if you want to reset some global state that will be used by many tests.
            </td>
        </tr>
        <tr>
            <td>
                describe(name, fn)
            </td>
            <td>
                describe(name, fn) creates a block that groups together several related tests. For example, if you have a myBeverage object that is supposed to be delicious but not sour, you could test it with:
            </td>
        </tr>
        <tr>
                    <td>
                        describe.each(table)(name, fn, timeout)
                    </td>
                    <td>
                        Use describe.each if you keep duplicating the same test suites with different data. describe.each allows you to write the test suite once and pass data in.
                        <br/><br/>
                            describe.each is available with two APIs
                        <br/><br/>
                        1. table: Array of Arrays with the arguments that are passed into the fn for each row.
                        Note If you pass in a 1D array of primitives, internally it will be mapped to a table i.e. [1, 2, 3] -> [[1], [2], [3]]
                        <br/><br/>
                        name: String the title of the test suite.
                        Generate unique test titles by positionally injecting parameters with printf formatting.
                        <br/><br/>
                        2. describe.each`table`(name, fn, timeout)
                        <br/><br/>
                        <a href="https://jestjs.io/docs/en/api#describeeachtablename-fn-timeout" target="_blank">full doc</a>
                    </td>
                </tr>
        <tr>
            <td>
                describe.only(name, fn)
            </td>
            <td>
                Also under the alias: fdescribe(name, fn)
                You can use describe.only if you want to run only one describe block:
            </td>
        </tr>
<tr>
            <td>
                describe.only.each(table)(name, fn)
            </td>
            <td>
                Also under the aliases: fdescribe.each(table)(name, fn) and fdescribe.each`table`(name, fn)
                Use describe.only.each if you want to only run specific tests suites of data driven tests.
                <br/><br/>
                describe.only.each is available with two APIs:
                            <br/><br/>
               <a href="https://jestjs.io/docs/en/api#describeonlyeachtablename-fn" target="_blank">full doc</a>
            </td>
        </tr>
<tr>
            <td>
                describe.skip(name, fn)
            </td>
            <td>
                Also under the alias: xdescribe(name, fn)
                You can use describe.skip if you do not want to run a particular describe block:
            </td>
        </tr>
<tr>
            <td>
                describe.skip.each(table)(name, fn)
            </td>
            <td>
                Also under the aliases: xdescribe.each(table)(name, fn) and xdescribe.each`table`(name, fn)
                Use describe.skip.each if you want to stop running a suite of data driven tests.
                <br/><br/>
                describe.skip.each is available with two APIs:
                            <br/><br/>
               <a href="https://jestjs.io/docs/en/api#describeskipeachtablename-fn" target="_blank">full doc</a>
            </td>
        </tr>
<tr>
            <td>
                test(name, fn, timeout)
            </td>
            <td>
                Also under the alias: it(name, fn, timeout)
                All you need in a test file is the test method which runs a test. For example, let's say there's a function inchesOfRain() that should be zero. Your whole test could be:
                 <br/><br/>
                 The first argument is the test name; the second argument is a function that contains the expectations to test. The third argument (optional) is timeout (in milliseconds) for specifying how long to wait before aborting. Note: The default timeout is 5 seconds.
                 <br/><br/>
                 Note: If a promise is returned from test, Jest will wait for the promise to resolve before letting the test complete. Jest will also wait if you provide an argument to the test function, usually called done. This could be handy when you want to test callbacks.
            </td>
        </tr>
<tr>
            <td>
                test.concurrent(name, fn, timeout)
            </td>
            <td>
                Also under the alias: it.concurrent(name, fn, timeout)
                Use test.concurrent if you want the test to run concurrently.
                <br/><br/>
                The first argument is the test name; the second argument is an asynchronous function that contains the expectations to test. The third argument (optional) is timeout (in milliseconds) for specifying how long to wait before aborting. Note: The default timeout is 5 seconds.
            </td>
        </tr>
<tr>
            <td>
                test.concurrent.each(table)(name, fn, timeout)
            </td>
            <td>
                Also under the alias: it.concurrent.each(table)(name, fn, timeout)
                Use test.concurrent.each if you keep duplicating the same test with different data. test.each allows you to write the test once and pass data in, the tests are all run asynchronously.
                <br/><br/>
                test.concurrent.each is available with two APIs:
                <br/><br/>
                1. test.concurrent.each(table)(name, fn, timeout)
               <br/><br/>
                2. test.concurrent.each`table`(name, fn, timeout)
                <br/><br/>
                <a href="https://jestjs.io/docs/en/api#describeskipeachtablename-fn" target="_blank">full doc</a>
            </td>
        </tr>
<tr>
            <td>
                test.concurrent.only.each(table)(name, fn)
            </td>
            <td>
                Also under the alias: it.concurrent.only.each(table)(name, fn)
                <br/><br/>
                Use test.concurrent.only.each if you want to only run specific tests with different test data concurrently.
                <br/><br/>
                <a href="https://jestjs.io/docs/en/api#testconcurrentonlyeachtablename-fn" target="_blank">full doc</a>
            </td>
        </tr>
        <tr>
            <td>
                test.concurrent.skip.each(table)(name, fn)
            </td>
            <td>
                Also under the alias: it.concurrent.skip.each(table)(name, fn)
                <br/><br/>
                Use test.concurrent.skip.each if you want to stop running a collection of asynchronous data driven tests.
                <br/><br/>
                <a href="https://jestjs.io/docs/en/api#testconcurrentskipeachtablename-fn" target="_blank">full doc</a>
            </td>
        </tr>
<tr>
            <td>
                test.each(table)(name, fn, timeout)
            </td>
            <td>
                Also under the alias: it.each(table)(name, fn) and it.each`table`(name, fn)
                Use test.each if you keep duplicating the same test with different data. test.each allows you to write the test once and pass data in.
                <br/><br/>
                test.each is available with two APIs:
                <br/><br/>
                1. test.each(table)(name, fn, timeout)
                               <br/><br/>
                2. test.each`table`(name, fn, timeout)
                                                        <br/><br/>
                <a href="https://jestjs.io/docs/en/api#testeachtablename-fn-timeout" target="_blank">full doc</a>
            </td>
        </tr>

<tr>
            <td>
                test.only(name, fn, timeout)
            </td>
            <td>
                Also under the aliases: it.only(name, fn, timeout), and fit(name, fn, timeout)
                When you are debugging a large test file, you will often only want to run a subset of tests. You can use .only to specify which tests are the only ones you want to run in that test file.
                Optionally, you can provide a timeout (in milliseconds) for specifying how long to wait before aborting. Note: The default timeout is 5 seconds.
            </td>
        </tr>
        <tr>
                    <td>
                        test.only.each(table)(name, fn)
                    </td>
                    <td>
                        Also under the aliases: it.only.each(table)(name, fn), fit.each(table)(name, fn), it.only.each`table`(name, fn) and fit.each`table`(name, fn)
                        Use test.only.each if you want to only run specific tests with different test data.
                        <br/><br/>
                        test.only.each is available with two APIs:
                        <br/><br/>
                        <a href="https://jestjs.io/docs/en/api#testonlyeachtablename-fn" target="_blank">full doc</a>
                    </td>
                </tr>
        <tr>
                    <td>
                    test.skip(name, fn)
                    </td>
                    <td>
                        Also under the aliases: it.skip(name, fn), xit(name, fn), and xtest(name, fn)
                        When you are maintaining a large codebase, you may sometimes find a test that is temporarily broken for some reason. If you want to skip running this test, but you don't want to delete this code, you can use test.skip to specify some tests to skip.
                    </td>
                </tr>
        <tr>
                    <td>
                        test.skip.each(table)(name, fn)
                    </td>
                    <td>
                        Also under the aliases: it.skip.each(table)(name, fn), xit.each(table)(name, fn), xtest.each(table)(name, fn), it.skip.each`table`(name, fn), xit.each`table`(name, fn) and xtest.each`table`(name, fn)
                        Use test.skip.each if you want to stop running a collection of data driven tests.
                    <br/><br/>
                        test.skip.each is available with two APIs:
                        <br/><br/>
                        <a href="https://jestjs.io/docs/en/api#testskipeachtablename-fn" target="_blank">full doc</a>
                    </td>
                </tr>
        <tr>
                    <td>
                        test.todo(name)
                    </td>
                    <td>
                        Also under the alias: it.todo(name)
                        Use test.todo when you are planning on writing tests. These tests will be highlighted in the summary output at the end so you know how many tests you still need todo.
                        Note: If you supply a test callback function then the test.todo will throw an error. If you have already implemented the test and it is broken and you do not want it to run, then use test.skip instead.
                    </td>
                </tr>
    </tbody>
</table>

### Expect

[docs](https://jestjs.io/docs/en/expect)

expect(value)

The expect function is used every time you want to test a value. You will rarely call expect by itself. Instead, you will use expect along with a "matcher" function to assert something about value.

It's easier to understand this with an example. Let's say you have a method bestLaCroixFlavor() which is supposed to return the string 'grapefruit'. Here's how you would test that:

```javascript
test('the best flavor is grapefruit', () => {
    expect(bestLaCroixFlavor()).toBe('grapefruit');
});
```

In this case, toBe is the matcher function. There are a lot of different matcher functions, documented below, to help you test different things.

The argument to expect should be the value that your code produces, and any argument to the matcher should be the correct value. If you mix them up, your tests will still work, but the error messages on failing tests will look strange.

#### .not

If you know how to test something, .not lets you test its opposite. For example, this code tests that the best La Croix flavor is not coconut:

```javascript
test('the best flavor is not coconut', () => {
    expect(bestLaCroixFlavor()).not.toBe('coconut');
});
```

#### .resolves

 Use resolves to unwrap the value of a fulfilled promise so any other matcher can be chained. If the promise is rejected the assertion fails.

 For example, this code tests that the promise resolves and that the resulting value is 'lemon':

```javascript
test('resolves to lemon', () => {
    // make sure to add a return statement
    return expect(Promise.resolve('lemon')).resolves.toBe('lemon');
});
```

#### .rejects

Use .rejects to unwrap the reason of a rejected promise so any other matcher can be chained. If the promise is fulfilled the assertion fails.

For example, this code tests that the promise rejects with reason 'octopus':

```javascript
test('rejects to octopus', () => {
    // make sure to add a return statement
    return expect(Promise.reject(new Error('octopus'))).rejects.toThrow(
        'octopus',
    );
});
```

<table>
    <thead>
        <tr>
            <th>Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
               expect.extend(matchers)
            </td>
            <td>
             You can use expect.extend to add your own matchers to Jest. For example, let's say that you're testing a number utility library and you're frequently asserting that numbers appear within particular ranges of other numbers. You could abstract that into a toBeWithinRange matcher:
            </td>
        </tr>
        <tr>
                    <td>
                       expect.anything()
                    </td>
                    <td>
                        matches anything but null or undefined. You can use it inside toEqual or toBeCalledWith instead of a literal value. For example, if you want to check that a mock function is called with a non-null argument:
                    </td>
                </tr>
    <tr>
                <td>
                   expect.any(constructor)
                </td>
                <td>
                   expect.any(constructor) matches anything that was created with the given constructor. You can use it inside toEqual or toBeCalledWith instead of a literal value. For example, if you want to check that a mock function is called with a number:
                </td>
            </tr>
    <tr>
                    <td>
                       expect.arrayContaining(array)
                    </td>
                    <td>
                         matches a received array which contains all of the elements in the expected array. That is, the expected array is a subset of the received array. Therefore, it matches a received array which contains elements that are not in the expected array.
                         You can use it instead of a literal value:
                         <br/><br/>
                             - in toEqual or toBeCalledWith <br/><br/>
                             - to match a property in objectContaining or toMatchObject
                              <br/><br/>
                         <br/><br/>
                         expect.not.arrayContaining(array) matches a received array which does not contain all of the elements in the expected array. That is, the expected array is not a subset of the received array.
                    </td>
                </tr>
    <tr>
                    <td>
                       expect.assertions(number)
                    </td>
                    <td>
                    verifies that a certain number of assertions are called during a test. This is often useful when testing asynchronous code, in order to make sure that assertions in a callback actually got called.
                    For example, let's say that we have a function doAsync that receives two callbacks callback1 and callback2, it will asynchronously call both of them in an unknown order. We can test this with:
                    </td>
                </tr>
    <tr>
                    <td>
                       expect.hasAssertions()
                    </td>
                    <td>
                    verifies that at least one assertion is called during a test. This is often useful when testing asynchronous code, in order to make sure that assertions in a callback actually got called.
                    For example, let's say that we have a few functions that all deal with state. prepareState calls a callback with a state object, validateState runs on that state object, and waitOnState returns a promise that waits until all prepareState callbacks complete. We can test this with:
                    </td>
                </tr>
    <tr>
                    <td>
                            expect.objectContaining(object)
                    </td>
                    <td>
                            matches any received object that recursively matches the expected properties. That is, the expected object is a subset of the received object. Therefore, it matches a received object which contains properties that are present in the expected object.
                            Instead of literal property values in the expected object, you can use matchers, expect.anything(), and so on.
                            <br/><br/>
                            expect.not.objectContaining(object) matches any received object that does not recursively match the expected properties. That is, the expected object is not a subset of the received object. Therefore, it matches a received object which contains properties that are not in the expected object.
                    </td>
                </tr>
    <tr>
                    <td>
                       expect.stringContaining(string)
                    </td>
                    <td>
                        matches the received value if it is a string that contains the exact expected string.
                        <br/><br/>
                        expect.not.stringContaining(string) matches the received value if it is not a string or if it is a string that does not contain the exact expected string.
                    </td>
                </tr>
    <tr>
                    <td>
                       expect.stringMatching(string | regexp)
                    </td>
                    <td>
                        matches the received value if it is a string that matches the expected string or regular expression.
                        You can use it instead of a literal value:
                        <br/><br/>
                            -in toEqual or toBeCalledWith <br/><br/>
                            - to match an element in arrayContaining <br/><br/>
                            - to match a property in objectContaining or toMatchObject <br/><br/>
                        <br/><br/>
                        expect.not.stringMatching(string | regexp) matches the received value if it is not a string or if it is a string that does not match the expected string or regular expression.
                    </td>
                </tr>
    <tr>
                    <td>
                        expect.addSnapshotSerializer(serializer)
                    </td>
                    <td>
                        You can call expect.addSnapshotSerializer to add a module that formats application-specific data structures.
                        For an individual test file, an added module precedes any modules from snapshotSerializers configuration, which precede the default snapshot serializers for built-in JavaScript types and for React elements. The last module added is the first module tested.
                         <br/><br/>
                        <a href="https://jestjs.io/docs/en/expect#expectaddsnapshotserializerserializer" target="_blank">full doc</a>
                    </td>
                </tr>
    <tr>
                    <td>
                       .toBe(value)
                    </td>
                    <td>
                        Use .toBe to compare primitive values or to check referential identity of object instances. It calls Object.is to compare values, which is even better for testing than === strict equality operator.
                        <br/><br/>
                        Don't use .toBe with floating-point numbers. For example, due to rounding, in JavaScript 0.2 + 0.1 is not strictly equal to 0.3. If you have floating point numbers, try .toBeCloseTo instead.
                        <br/><br/>
                        Although the .toBe matcher checks referential identity, it reports a deep comparison of values if the assertion fails. If differences between properties do not help you to understand why a test fails, especially if the report is large, then you might move the comparison into the expect function. For example, to assert whether or not elements are the same instance:
                        <br/><br/><br/><br/>
                        rewrite expect(received).toBe(expected) as expect(Object.is(received, expected)).toBe(true)<br/><br/>
                        rewrite expect(received).not.toBe(expected) as expect(Object.is(received, expected)).toBe(false)
                    </td>
                </tr>
    <tr>
                    <td>
                       .toHaveBeenCalled()
                    </td>
                    <td>
                          Also under the alias: .toBeCalled()
                          Use .toHaveBeenCalled to ensure that a mock function got called.
                    </td>
                </tr>
    <tr>
                    <td>
                       .toHaveBeenCalledTimes(number)
                    </td>
                    <td>
                       Also under the alias: .toBeCalledTimes(number)
                       Use .toHaveBeenCalledTimes to ensure that a mock function got called exact number of times.
                    </td>
                </tr>
    <tr>
                    <td>
                       .toHaveBeenCalledWith(arg1, arg2, ...)
                    </td>
                    <td>
                        Also under the alias: .toBeCalledWith()
                        Use .toHaveBeenCalledWith to ensure that a mock function was called with specific arguments.
                    </td>
                </tr>
    <tr>
                    <td>
                       .toHaveBeenLastCalledWith(arg1, arg2, ...)
                    </td>
                    <td>
                       Also under the alias: .lastCalledWith(arg1, arg2, ...)
                       If you have a mock function, you can use .toHaveBeenLastCalledWith to test what arguments it was last called with.
                    </td>
                </tr>
    <tr>
                    <td>
                       .toHaveBeenNthCalledWith(nthCall, arg1, arg2, ....)
                    </td>
                    <td>
                        Also under the alias: .nthCalledWith(nthCall, arg1, arg2, ...)
                        If you have a mock function, you can use .toHaveBeenNthCalledWith to test what arguments it was nth called with
                    </td>
                </tr>
    <tr>
                    <td>
                       .toHaveReturned()
                    </td>
                    <td>
                      Also under the alias: .toReturn()
                      If you have a mock function, you can use .toHaveReturned to test that the mock function successfully returned (i.e., did not throw an error) at least one time.
                    </td>
                </tr>
    <tr>
                    <td>
                       .toHaveReturnedTimes(number)
                    </td>
                    <td>
                       lso under the alias: .toReturnTimes(number)
                       Use .toHaveReturnedTimes to ensure that a mock function returned successfully (i.e., did not throw an error) an exact number of times. Any calls to the mock function that throw an error are not counted toward the number of times the function returned.
                    </td>
                </tr>
    <tr>
                    <td>
                      .toHaveReturnedWith(value)
                    </td>
                    <td>
                       Also under the alias: .toReturnWith(value)
                       Use .toHaveReturnedWith to ensure that a mock function returned a specific value.
                    </td>
                </tr>
    <tr>
                    <td>
                      .toHaveLastReturnedWith(value)
                    </td>
                    <td>
                      Also under the alias: .lastReturnedWith(value)
                      Use .toHaveLastReturnedWith to test the specific value that a mock function last returned. If the last call to the mock function threw an error, then this matcher will fail no matter what value you provided as the expected return value.
                    </td>
                </tr>
    <tr>
                    <td>
                      .toHaveNthReturnedWith(nthCall, value)
                    </td>
                    <td>
                      Also under the alias: .nthReturnedWith(nthCall, value)
                      Use .toHaveNthReturnedWith to test the specific value that a mock function returned for the nth call. If the nth call to the mock function threw an error, then this matcher will fail no matter what value you provided as the expected return value.
                    </td>
                </tr>
    <tr>
                    <td>
                      .toHaveLength(number)
                    </td>
                    <td>
                      Use .toHaveLength to check that an object has a .length property and it is set to a certain numeric value.
                      This is especially useful for checking arrays or strings size.
                    </td>
                </tr>
        <tr>
                        <td>
                          .toHaveProperty(keyPath, value?)
                        </td>
                        <td>
                           Use .toHaveProperty to check if property at provided reference keyPath exists for an object. For checking deeply nested properties in an object you may use dot notation or an array containing the keyPath for deep references.
                           You can provide an optional value argument to compare the received property value (recursively for all properties of object instances, also known as deep equality, like the toEqual matcher).
                        </td>
                    </tr>
<tr>
                        <td>
                          .toBeCloseTo(number, numDigits?)
                        </td>
                        <td>
                          Use toBeCloseTo to compare floating point numbers for approximate equality.
                          The optional numDigits argument limits the number of digits to check after the decimal point. For the default value 2, the test criterion is Math.abs(expected - received) < 0.005 (that is, 10 ** -2 / 2).
                          Intuitive equality comparisons often fail, because arithmetic on decimal (base 10) values often have rounding errors in limited precision binary (base 2) representation
                          <br/><br/>
                          * Because floating point errors are the problem that toBeCloseTo solves, it does not support big integer values.
                        </td>
                    </tr>
    <tr>
                            <td>
                              .toBeDefined()
                            </td>
                            <td>
                              Use .toBeDefined to check that a variable is not undefined. For example, if you want to check that a function fetchNewFlavorIdea() returns something, you can write:
                            </td>
                        </tr>
    <tr>
                            <td>
                              .toBeFalsy()
                            </td>
                            <td>
                              Use .toBeFalsy when you don't care what a value is and you want to ensure a value is false in a boolean context.
                              In JavaScript, there are six falsy values: false, 0, '', null, undefined, and NaN. Everything else is truthy.
                            </td>
                        </tr>
<tr>
                        <td>
                          .toBeGreaterThan(number | bigint)
                        </td>
                        <td>
                           Use toBeGreaterThan to compare received > expected for number or big integer values.
                        </td>
                    </tr>
<tr>
                        <td>
                          .toBeGreaterThanOrEqual(number | bigint)
                        </td>
                        <td>
                           Use toBeGreaterThanOrEqual to compare received >= expected for number or big integer values.
                        </td>
                    </tr>
<tr>
                        <td>
                          .toBeLessThan(number | bigint)
                        </td>
                        <td>
                           Use toBeLessThan to compare received < expected for number or big integer values
                        </td>
                    </tr>
<tr>
                        <td>
                          .toBeLessThanOrEqual(number | bigint)
                        </td>
                        <td>
                          Use toBeLessThanOrEqual to compare received <= expected for number or big integer values
                        </td>
                    </tr>
<tr>
                        <td>
                          .toBeInstanceOf(Class)
                        </td>
                        <td>
                           Use .toBeInstanceOf(Class) to check that an object is an instance of a class
                        </td>
                    </tr>
<tr>
                        <td>
                          .toBeNull()
                        </td>
                        <td>
                          .toBeNull() is the same as .toBe(null) but the error messages are a bit nicer. So use .toBeNull() when you want to check that something is null.
                        </td>
                    </tr>
<tr>
                        <td>
                         .toBeTruthy()
                        </td>
                        <td>
                           Use .toBeTruthy when you don't care what a value is and you want to ensure a value is true in a boolean context
                        </td>
                    </tr>
<tr>
                        <td>
                          .toBeUndefined()
                        </td>
                        <td>
                          Use .toBeUndefined to check that a variable is undefined. For example, if you want to check that a function bestDrinkForFlavor(flavor) returns undefined for the 'octopus' flavor, because there is no good octopus-flavored drink:
                        </td>
                    </tr>
<tr>
                        <td>
                          .toBeNaN()
                        </td>
                        <td>
                          Use .toBeNaN when checking a value is NaN
                        </td>
                    </tr>
<tr>
                        <td>
                          .toContain(item)
                        </td>
                        <td>
                          Use .toContain when you want to check that an item is in an array. For testing the items in the array, this uses ===, a strict equality check. .toContain can also check whether a string is a substring of another string.
                        </td>
                    </tr>
<tr>
                        <td>
                          .toContainEqual(item)
                        </td>
                        <td>
                          Use .toContainEqual when you want to check that an item with a specific structure and values is contained in an array. For testing the items in the array, this matcher recursively checks the equality of all fields, rather than checking for object identity.
                        </td>
                    </tr>
<tr>
                        <td>
                          .toEqual(value)
                        </td>
                        <td>
                         Use .toEqual to compare recursively all properties of object instances (also known as "deep" equality). It calls Object.is to compare primitive values, which is even better for testing than === strict equality operator.
                         <br/><br/>
                         Note: .toEqual won't perform a deep equality check for two errors. Only the message property of an Error is considered for equality. It is recommended to use the .toThrow matcher for testing against errors.
                        </td>
                    </tr>
<tr>
                        <td>
                          .toMatch(regexpOrString)
                        </td>
                        <td>
                           Use .toMatch to check that a string matches a regular expression.
                        </td>
                    </tr>
<tr>
                        <td>
                          .toMatchObject(object)
                        </td>
                        <td>
                          Use .toMatchObject to check that a JavaScript object matches a subset of the properties of an object. It will match received objects with properties that are not in the expected object.
                          <br/><br/>
                          You can also pass an array of objects, in which case the method will return true only if each object in the received array matches (in the toMatchObject sense described above) the corresponding object in the expected array. This is useful if you want to check that two arrays match in their number of elements, as opposed to arrayContaining, which allows for extra elements in the received array.
                        </td>
                    </tr>
<tr>
                        <td>
                          .toMatchSnapshot(propertyMatchers?, hint?)
                        </td>
                        <td>
                          This ensures that a value matches the most recent snapshot. Check out the <a href="https://jestjs.io/docs/en/snapshot-testing">Snapshot Testing guide</a> for more information.
                          <br/><br/>
                          You can provide an optional propertyMatchers object argument, which has asymmetric matchers as values of a subset of expected properties, if the received value will be an object instance. It is like toMatchObject with flexible criteria for a subset of properties, followed by a snapshot test as exact criteria for the rest of the properties.
                          <br/><br/>
                          You can provide an optional hint string argument that is appended to the test name. Although Jest always appends a number at the end of a snapshot name, short descriptive hints might be more useful than numbers to differentiate multiple snapshots in a single it or test block. Jest sorts snapshots by name in the corresponding .snap file.
                        </td>
                    </tr>
<tr>
                        <td>
                          .toMatchInlineSnapshot(propertyMatchers?, inlineSnapshot)
                        </td>
                        <td>
                           Ensures that a value matches the most recent snapshot.
                           <br/><br/>
                           You can provide an optional propertyMatchers object argument, which has asymmetric matchers as values of a subset of expected properties, if the received value will be an object instance. It is like toMatchObject with flexible criteria for a subset of properties, followed by a snapshot test as exact criteria for the rest of the properties.
                           <br/><br/>
                           Jest adds the inlineSnapshot string argument to the matcher in the test file (instead of an external .snap file) the first time that the test runs.
                           <br/><br/>
                           Check out the section on <a href="https://jestjs.io/docs/en/snapshot-testing#inline-snapshots">Inline Snapshots</a> for more info.
                        </td>
                    </tr>
<tr>
                        <td>
                          .toStrictEqual(value)
                        </td>
                        <td>
                           Use .toStrictEqual to test that objects have the same types as well as structure.
                           <br/><br/>
                           Differences from .toEqual:
                           <br/><br/>
                            <ul>
                                <li>Keys with undefined properties are checked. e.g. {a: undefined, b: 2} does not match {b: 2} when using .toStrictEqual.</li>
                                <li>Array sparseness is checked. e.g. [, 1] does not match [undefined, 1] when using .toStrictEqual.</li>
                                <li>Object types are checked to be equal. e.g. A class instance with fields a and b will not equal a literal object with fields a and b.</li>
                            </ul>
                        </td>
                    </tr>
<tr>
                        <td>
                          .toThrow(error?)
                        </td>
                        <td>
                            Also under the alias: .toThrowError(error?)
                            Use .toThrow to test that a function throws when it is calle
                            <br/><br/>
                            Note: You must wrap the code in a function, otherwise the error will not be caught and the assertion will fail.
                             <br/><br/>
                            You can provide an optional argument to test that a specific error is thrown:
                             <br/><br/>
                              <ul>
                                <li>regular expression: error message matches the pattern</li>
                                <li>string: error message includes the substring</li>
                                <li>error object: error message is equal to the message property of the object</li>
                                <li>error class: error object is instance of class</li>
                            </ul>
                        </td>
                    </tr>
<tr>
                        <td>
                          .toThrowErrorMatchingSnapshot(hint?)
                        </td>
                        <td>
                          Use .toThrowErrorMatchingSnapshot to test that a function throws an error matching the most recent snapshot when it is called.
                          You can provide an optional hint string argument that is appended to the test name. Although Jest always appends a number at the end of a snapshot name, short descriptive hints might be more useful than numbers to differentiate multiple snapshots in a single it or test block. Jest sorts snapshots by name in the corresponding .snap file.
                        </td>
                    </tr>
<tr>
                        <td>
                          .toThrowErrorMatchingInlineSnapshot(inlineSnapshot)
                        </td>
                        <td>
                           Use .toThrowErrorMatchingInlineSnapshot to test that a function throws an error matching the most recent snapshot when it is called.
                           Jest adds the inlineSnapshot string argument to the matcher in the test file (instead of an external .snap file) the first time that the test runs
                        </td>
                    </tr>
    </tbody>
</table>

### Mock Functions

[docs](https://jestjs.io/docs/en/mock-function-api)

Mock functions are also known as "spies", because they let you spy on the behavior of a function that is called indirectly by some other code, rather than only testing the output. You can create a mock function with jest.fn(). If no implementation is given, the mock function will return undefined when invoked.

<table>
    <thead>
        <tr>
            <th>Prop/Method</th>
            <th>Description</th>
        </tr>
    </thead>
    <tbody>
    <tr>
        <td>
            mockFn.getMockName()
        </td>
        <td>
          Returns the mock name string set by calling mockFn.mockName(value).
        </td>
    </tr>
    <tr>
        <td>
            mockFn.mock.calls
        </td>
        <td>
           An array containing the call arguments of all calls that have been made to this mock function. Each item in the array is an array of arguments that were passed during the call.
        </td>
    </tr>
    <tr>
        <td>
        mockFn.mock.results
        </td>
        <td>
             An array containing the results of all calls that have been made to this mock function. Each entry in this array is an object containing a type property, and a value property. type will be one of the following:
              <br/><br/>
              <ul>
                  <li>'return' - Indicates that the call completed by returning normally.</li>
                  <li>'throw' - Indicates that the call completed by throwing a value.</li>
                  <li>'incomplete' - Indicates that the call has not yet completed. This occurs if you test the result from within the mock function itself, or from within a function that was called by the mock.</li>
              </ul>
              The value property contains the value that was thrown or returned. value is undefined when type === 'incomplete'.
        </td>
    </tr>
    <tr>
        <td>
            mockFn.mock.instances
        </td>
        <td>
           An array that contains all the object instances that have been instantiated from this mock function using new.
        </td>
    </tr>
    <tr>
        <td>
            mockFn.mockClear()
        </td>
        <td>
          Resets all information stored in the mockFn.mock.calls and mockFn.mock.instances arrays.
          Often this is useful when you want to clean up a mock's usage data between two assertions.
           <br/><br/>
          Beware that mockClear will replace mockFn.mock, not just mockFn.mock.calls and mockFn.mock.instances. You should, therefore, avoid assigning mockFn.mock to other variables, temporary or not, to make sure you don't access stale data.
     <br/><br/>
          The clearMocks configuration option is available to clear mocks automatically between tests.
        </td>
    </tr>
    <tr>
        <td>
        mockFn.mockReset()
        </td>
        <td>
               Does everything that mockFn.mockClear() does, and also removes any mocked return values or implementations.
               This is useful when you want to completely reset a mock back to its initial state. (Note that resetting a spy will result in a function with no return value).
                <br/><br/>
               Beware that mockReset will replace mockFn.mock, not just mockFn.mock.calls and mockFn.mock.instances. You should, therefore, avoid assigning mockFn.mock to other variables, temporary or not, to make sure you don't access stale data.
        </td>
    </tr>
    <tr>
        <td>
         mockFn.mockRestore()
        </td>
        <td>
            Does everything that mockFn.mockReset() does, and also restores the original (non-mocked) implementation.
            This is useful when you want to mock functions in certain test cases and restore the original implementation in others.
                    <br/><br/>
            Beware that mockFn.mockRestore only works when the mock was created with jest.spyOn. Thus you have to take care of restoration yourself when manually assigning jest.fn().
                    <br/><br/>
            The restoreMocks configuration option is available to restore mocks automatically between tests.
        </td>
    </tr>
    <tr>
        <td>
        mockFn.mockImplementation(fn)
        </td>
        <td>
          Accepts a function that should be used as the implementation of the mock. The mock itself will still record all calls that go into and instances that come from itself – the only difference is that the implementation will also be executed when the mock is called.
                <br/><br/>
          Note: jest.fn(implementation) is a shorthand for jest.fn().mockImplementation(implementation).
        </td>
    </tr>
    <tr>
        <td>
            mockFn.mockImplementationOnce(fn)
        </td>
        <td>
          Accepts a function that will be used as an implementation of the mock for one call to the mocked function. Can be chained so that multiple function calls produce different results.
          <br/><br/>
          When the mocked function runs out of implementations defined with mockImplementationOnce, it will execute the default implementation set with jest.fn(() => defaultValue) or .mockImplementation(() => defaultValue) if they were called:
        </td>
    </tr>
    <tr>
        <td>
        mockFn.mockName(value)
        </td>
        <td>
           Accepts a string to use in test result output in place of "jest.fn()" to indicate which mock function is being referenced.
        </td>
    </tr>
    <tr>
        <td>
            mockFn.mockReturnThis()
        </td>
        <td>
            Syntactic sugar function for:
            <br/>
            jest.fn(function () {
              return this;
            });
        </td>
    </tr>
    <tr>
        <td>
        mockFn.mockReturnValue(value)
        </td>
        <td>
          Accepts a value that will be returned whenever the mock function is called.
        </td>
    </tr>
    <tr>
        <td>
        mockFn.mockReturnValueOnce(value)
        </td>
        <td>
           Accepts a value that will be returned for one call to the mock function. Can be chained so that successive calls to the mock function return different values. When there are no more mockReturnValueOnce values to use, calls will return a value specified by mockReturnValue.
        </td>
    </tr>
    <tr>
        <td>
        mockFn.mockResolvedValue(value)
        </td>
        <td>
          Syntactic sugar function for:
           <br/>
          jest.fn().mockImplementation(() => Promise.resolve(value));
        </td>
    </tr>
     <tr>
            <td>
                mockFn.mockResolvedValueOnce(value)
            </td>
            <td>
               Syntactic sugar function for:
                <br/>
               jest.fn().mockImplementationOnce(() => Promise.resolve(value));
            </td>
        </tr>
 <tr>
        <td>
        mockFn.mockRejectedValue(value)
        </td>
        <td>
           Syntactic sugar function for:
            <br/>
           jest.fn().mockImplementation(() => Promise.reject(value));
        </td>
    </tr>
 <tr>
        <td>
            mockFn.mockRejectedValueOnce(value)
        </td>
        <td>
           Syntactic sugar function for:
           <br/>
           jest.fn().mockImplementationOnce(() => Promise.reject(value));
        </td>
    </tr>
    </tbody>
</table>

### The Jest Object

[docs](https://jestjs.io/docs/en/jest-object)

The jest object is automatically in scope within every test file. The methods in the jest object help create mocks and let you control Jest's overall behavior. It can also be imported explicitly by via import {jest} from '@jest/globals'.

<table>
    <thead>
            <tr>
                <th>Method</th>
                <th>Description</th>
            </tr>
        </thead>
 <tr>
        <td>
            jest.disableAutomock()
        </td>
        <td>
           Disables automatic mocking in the module loader.
           Returns the jest object for chaining.
        </td>
    </tr>
 <tr>
        <td>
            jest.enableAutomock()
        </td>
        <td>
            Enables automatic mocking in the module loader.
            Returns the jest object for chaining.
        </td>
    </tr>
 <tr>
        <td>
            jest.createMockFromModule(moduleName)
        </td>
        <td>
          Also under the alias: .genMockFromModule(moduleName)
          Given the name of a module, use the automatic mocking system to generate a mocked version of the module for you.
          <br/><br/>
          <a href="https://jestjs.io/docs/en/jest-object#jestcreatemockfrommodulemodulename">full doc</a>
        </td>
    </tr>
 <tr>
        <td>
            jest.mock(moduleName, factory, options)
        </td>
        <td>
           Mocks a module with an auto-mocked version when it is being required. factory and options are optional
           <br/><br/>
           The second argument can be used to specify an explicit module factory that is being run instead of using Jest's automocking feature:
           <br/><br/>
           The third argument can be used to create virtual mocks – mocks of modules that don't exist anywhere in the system
            <br/><br/>
           Returns the jest object for chaining.
        </td>
    </tr>
 <tr>
        <td>
        jest.unmock(moduleName)
        </td>
        <td>
               Indicates that the module system should never return a mocked version of the specified module from require() (e.g. that it should always return the real module).
               The most common use of this API is for specifying the module a given test intends to be testing (and thus doesn't want automatically mocked).
               <br/><br/>
               Returns the jest object for chaining.
        </td>
    </tr>
 <tr>
        <td>
        jest.doMock(moduleName, factory, options)
        </td>
        <td>
          When using babel-jest, calls to mock will automatically be hoisted to the top of the code block. Use this method if you want to explicitly avoid this behavior.
          <br/><br/>
                         Returns the jest object for chaining.
        </td>
    </tr>
 <tr>
        <td>
        jest.dontMock(moduleName)
        </td>
        <td>
             When using babel-jest, calls to unmock will automatically be hoisted to the top of the code block. Use this method if you want to explicitly avoid this behavior.
             <br/><br/>
             Returns the jest object for chaining.
        </td>
    </tr>
 <tr>
        <td>
        jest.setMock(moduleName, moduleExports)
        </td>
        <td>
            Explicitly supplies the mock object that the module system should return for the specified module.
            <br/><br/>
            On occasion, there are times where the automatically generated mock the module system would normally provide you isn't adequate enough for your testing needs. Normally under those circumstances you should write a manual mock that is more adequate for the module in question. However, on extremely rare occasions, even a manual mock isn't suitable for your purposes and you need to build the mock yourself inside your test.
                         <br/><br/>
            Note It is recommended to use jest.mock() instead. The jest.mock API's second argument is a module factory instead of the expected exported module object.
                         <br/><br/>
                         Returns the jest object for chaining.
        </td>
    </tr>
 <tr>
        <td>
        jest.requireActual(moduleName)
        </td>
        <td>
            Returns the actual module instead of a mock, bypassing all checks on whether the module should receive a mock implementation or not.
        </td>
    </tr>
 <tr>
        <td>
        jest.requireMock(moduleName)
        </td>
        <td>
         Returns a mock module instead of the actual module, bypassing all checks on whether the module should be required normally or not.
        </td>
    </tr>
 <tr>
        <td>
        jest.resetModules()
        </td>
        <td>
            Resets the module registry - the cache of all required modules. This is useful to isolate modules where local state might conflict between tests.
              <br/><br/>
         Returns the jest object for chaining.
        </td>
    </tr>
 <tr>
        <td>
        jest.isolateModules(fn)
        </td>
        <td>
           jest.isolateModules(fn) goes a step further than jest.resetModules() and creates a sandbox registry for the modules that are loaded inside the callback function. This is useful to isolate specific modules for every test so that local module state doesn't conflict between tests.
        </td>
    </tr>
     <tr>
            <td>
                jest.fn(implementation)
            </td>
            <td>
               Returns a new, unused <a href="#mock-functions">mock</a> function. Optionally takes a mock implementation.
            </td>
        </tr>
 <tr>
        <td>
            jest.isMockFunction(fn)
        </td>
        <td>
        Determines if the given function is a mocked function.
        </td>
    </tr>
     <tr>
            <td>
            jest.spyOn(object, methodName)
            </td>
            <td>
               Creates a mock function similar to jest.fn but also tracks calls to object[methodName]. Returns a Jest mock function.
                 <br/><br/>
               Note: By default, jest.spyOn also calls the spied method. This is different behavior from most other test libraries. If you want to overwrite the original function, you can use jest.spyOn(object, methodName).mockImplementation(() => customImplementation) or object[methodName] = jest.fn(() => customImplementation);
            </td>
        </tr>
 <tr>
        <td>
        jest.spyOn(object, methodName, accessType?)
        </td>
        <td>
          Since Jest 22.1.0+, the jest.spyOn method takes an optional third argument of accessType that can be either 'get' or 'set', which proves to be useful when you want to spy on a getter or a setter, respectively.
        </td>
    </tr>
 <tr>
        <td>
        jest.clearAllMocks()
        </td>
        <td>
            Clears the mock.calls and mock.instances properties of all mocks. Equivalent to calling .mockClear() on every mocked function.
              <br/><br/>
            Returns the jest object for chaining.
        </td>
    </tr>
 <tr>
        <td>
            jest.resetAllMocks()
        </td>
        <td>
         Resets the state of all mocks. Equivalent to calling .mockReset() on every mocked function.
         <br/><br/>
         Returns the jest object for chaining.
        </td>
    </tr>
 <tr>
        <td>
        jest.restoreAllMocks()
        </td>
        <td>
          Restores all mocks back to their original value. Equivalent to calling .mockRestore() on every mocked function. Beware that jest.restoreAllMocks() only works when the mock was created with jest.spyOn; other mocks will require you to manually restore them.
        </td>
    </tr>
<tr>
        <td>
            jest.useFakeTimers(implementation?: 'modern' | 'legacy')
        </td>
        <td>
           Instructs Jest to use fake versions of the standard timer functions (setTimeout, setInterval, clearTimeout, clearInterval, nextTick, setImmediate and clearImmediate).
           <br/><br/>
           If you pass 'modern' as an argument, @sinonjs/fake-timers will be used as implementation instead of Jest's own fake timers. This also mocks additional timers like Date. 'modern' will be the default behavior in Jest 27.
           <br/><br/>
           Returns the jest object for chaining.
        </td>
    </tr>
<tr>
        <td>
        jest.useRealTimers()
        </td>
        <td>
          Instructs Jest to use the real versions of the standard timer functions.
          <br/><br/>
          Returns the jest object for chaining.
        </td>
    </tr>
<tr>
        <td>
        jest.runAllTicks()
        </td>
        <td>
            Exhausts the micro-task queue (usually interfaced in node via process.nextTick).
            <br/><br/>
            When this API is called, all pending micro-tasks that have been queued via process.nextTick will be executed. Additionally, if those micro-tasks themselves schedule new micro-tasks, those will be continually exhausted until there are no more micro-tasks remaining in the queue.
        </td>
    </tr>
<tr>
        <td>
        jest.runAllTimers()
        </td>
        <td>
           Exhausts both the macro-task queue (i.e., all tasks queued by setTimeout(), setInterval(), and setImmediate()) and the micro-task queue (usually interfaced in node via process.nextTick).
           <br/><br/>
           When this API is called, all pending macro-tasks and micro-tasks will be executed. If those tasks themselves schedule new tasks, those will be continually exhausted until there are no more tasks remaining in the queue.
           <br/><br/>
           This is often useful for synchronously executing setTimeouts during a test in order to synchronously assert about some behavior that would only happen after the setTimeout() or setInterval() callbacks executed. See the Timer mocks doc for more information.
        </td>
    </tr>
<tr>
        <td>
        jest.runAllImmediates()
        </td>
        <td>
           Exhausts all tasks queued by setImmediate().
            <br/><br/>
               Note: This function is not available when using modern fake timers implementation
        </td>
    </tr>
<tr>
        <td>
        jest.advanceTimersByTime(msToRun)
        </td>
        <td>
           Also under the alias: .runTimersToTime()
                    <br/><br/>
           Executes only the macro task queue (i.e. all tasks queued by setTimeout() or setInterval() and setImmediate()).
                    <br/><br/>
           When this API is called, all timers are advanced by msToRun milliseconds. All pending "macro-tasks" that have been queued via setTimeout() or setInterval(), and would be executed within this time frame will be executed. Additionally, if those macro-tasks schedule new macro-tasks that would be executed within the same time frame, those will be executed until there are no more macro-tasks remaining in the queue, that should be run within msToRun milliseconds.
        </td>
    </tr>
<tr>
        <td>
        jest.runOnlyPendingTimers()
        </td>
        <td>
          Executes only the macro-tasks that are currently pending (i.e., only the tasks that have been queued by setTimeout() or setInterval() up to this point). If any of the currently pending macro-tasks schedule new macro-tasks, those new tasks will not be executed by this call.
              <br/><br/>
          This is useful for scenarios such as one where the module being tested schedules a setTimeout() whose callback schedules another setTimeout() recursively (meaning the scheduling never stops). In these scenarios, it's useful to be able to run forward in time by a single step at a time.
        </td>
    </tr>
<tr>
        <td>
        jest.advanceTimersToNextTimer(steps)
        </td>
        <td>
          Advances all timers by the needed milliseconds so that only the next timeouts/intervals will run.
          Optionally, you can provide steps, so it will run steps amount of next timeouts/intervals.
        </td>
    </tr>
    <tr>
            <td>
            jest.clearAllTimers()
            </td>
            <td>
              Removes any pending timers from the timer system.
              This means, if any timers have been scheduled (but have not yet executed), they will be cleared and will never have the opportunity to execute in the future.
            </td>
        </tr>
        <tr>
                <td>
                jest.getTimerCount()
                </td>
                <td>
                  Returns the number of fake timers still left to run.
                </td>
            </tr>
<tr>
                <td>
                jest.setSystemTime(now?: number | Date)
                </td>
                <td>
                   Set the current system time used by fake timers. Simulates a user changing the system clock while your program is running. It affects the current time but it does not in itself cause e.g. timers to fire; they will fire exactly as they would have done without the call to jest.setSystemTime().
                   <br/><br/>
                   Note: This function is only available when using modern fake timers implementation
                </td>
            </tr>
<tr>
                <td>
                   jest.getRealSystemTime()
                </td>
                <td>
                   When mocking time, Date.now() will also be mocked. If you for some reason need access to the real current time, you can invoke this function.
                    <br/><br/>
                    Note: This function is only available when using modern fake timers implementation
                </td>
            </tr>
<tr>
                <td>
                jest.setTimeout(timeout)
                </td>
                <td>
                   Set the default timeout interval for tests and before/after hooks in milliseconds. This only affects the test file from which this function is called.
                    <br/><br/>
                   Note: The default timeout interval is 5 seconds if this method is not called.
                    <br/><br/>
                   Note: If you want to set the timeout for all test files, a good place to do this is in setupFilesAfterEnv
                </td>
            </tr>
<tr>
                <td>
                jest.retryTimes()
                </td>
                <td>
                    Runs failed tests n-times until they pass or until the max number of retries is exhausted. This only works with <a href="https://github.com/facebook/jest/tree/master/packages/jest-circus">jest-circus</a>!
                    <br/><br/>
                    Returns the jest object for chaining.
                </td>
            </tr>
    </tbody>
</table>
