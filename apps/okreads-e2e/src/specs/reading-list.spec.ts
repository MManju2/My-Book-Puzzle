import { $, $$, browser, ExpectedConditions } from 'protractor';

describe('When: I use the reading list feature', () => {
  it('Then: I should see my reading list', async () => {
    await browser.get('/');
    await browser.wait(
      ExpectedConditions.textToBePresentInElement($('tmo-root'), 'okreads')
    );

    const readingListToggle = $('[data-testing="toggle-reading-list"]');
    await readingListToggle.click();

    await browser.wait(
      ExpectedConditions.textToBePresentInElement(
        $('[data-testing="reading-list-container"]'),
        'My Reading List'
      )
    );
  });

  it('should be able to mark a book in my reading list as finished when I click finish icon', async () => {
    await $('.reading-list-container h2 button').click();
    const input = $('input[type="search"]');
    input.clear();
    input.sendKeys('angular');
    await $('form').submit();

    await $$('.book--content--info div button:enabled').first().click();
    await $('[data-testing="toggle-reading-list"]').click();

    await $$('[data-testing = "finishBookButton"]').last().click();

    await browser.wait(ExpectedConditions.not(
      ExpectedConditions.elementToBeClickable(
        $$('[data-testing = "finishBookButton"]').last()
      )
    ))
  });
});
