/**
 * Impressionist
 *
 * Impressionist is a visual ide for impress.js. impress.js is a presentation tool based on the power of CSS3 transforms and transitions
 * in modern browsers and inspired by the idea behind prezi.com.
 *
 * MIT Licensed.
 *
 * Impressionist Copyright 2012 Harish Sivaramakrishnan (@hsivaram) 
 */
function saveItem(key, value)
{
	if(isSupported())
	{
		localStorage.setItem(key, value);
	}

}
function getItem(key)
{

	return localStorage.getItem(key);
}
function isSupported()
{
	if(localStorage)
	{
		return true;
	}
	else
	{
		return false;
	}
}