import { Component, Renderer2, RendererFactory2, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './navbar/navbar';
import { Footer } from './footer/footer';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('snl-admin');
  private renderer: Renderer2;
  private currentTheme = 'light-theme'; // Default theme

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.applyTheme();
  }

  ngAfterViewInit() {
    this.toggleTheme();
  }

  applyTheme() {
    this.renderer.addClass(document.body, this.currentTheme);
  }

  toggleTheme() {
    const oldTheme = this.currentTheme;
    this.currentTheme = oldTheme === 'light-theme' ? 'dark-theme' : 'light-theme';
    this.renderer.removeClass(document.body, oldTheme);
    this.renderer.addClass(document.body, this.currentTheme);
  }

  isDarkTheme(): boolean {
    return this.currentTheme === 'dark-theme';
  }
}
