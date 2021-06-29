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

  it('should remove the added book from reading list when I click undo button', async () => {
    await $('.reading-list-container h2 button').click();
    const initialListCount = await $$('.reading-list-item').length;

    const input = $('input[type="search"]');
    input.clear();
    input.sendKeys('Node JS');
    await $('form').submit();

    await $$('.book--content--info div button:enabled').first().click();
    await browser.executeScript(`document.querySelector('simple-snack-bar button').click()`);
    await $('[data-testing="toggle-reading-list"]').click();

    const finalListCount = $$('.reading-list-item').length;
    expect(initialListCount).toEqual(finalListCount)
  });

  it('should add the removed book back to reading list when I click undo button', async () => {
    await $('.reading-list-container h2 button').click();
    const input = $('input[type="search"]');
    input.clear();
    input.sendKeys('Java');
    await $('form').submit();

    await $$('.book--content--info div button:enabled').first().click();
    await $('[data-testing="toggle-reading-list"]').click();

    const initialListCount = await $$('.reading-list-item').length;
    await $$('.reading-list-item div button').last().click();
    await browser.executeScript(`document.querySelector('simple-snack-bar button').click()`);

    const finalListCount = await $$('.reading-list-item').length;
    expect(initialListCount).toEqual(finalListCount)
  });
});
