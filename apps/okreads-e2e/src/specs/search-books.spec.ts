import { $, $$, browser, ExpectedConditions } from 'protractor';

describe('When: Use the search feature', () => {
  it('Then: I should be able to search books by title', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const form = $('form');
    const input = $('input[type="search"]');
    await input.sendKeys('javascript');
    await form.submit();

    const items = await $$('[data-testing="book-item"]');
    expect(items.length).toBeGreaterThan(1);
  });

  it('should be able to see search results as I am typing', async () => {
    const input = $('input[type="search"]');
    await input.clear();
    await input.sendKeys('Angular');

    const items = await $$('[data-testing= "book-item"]');
    expect(items.length).toBeGreaterThan(1, 'At least one book');
  });
});
