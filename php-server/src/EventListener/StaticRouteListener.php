<?php
namespace App\EventListener;

use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpKernel\Event\RequestEvent;

class StaticRouteListener {
	private $twig;

	public function __construct(\Twig\Environment $twig) {
		$this->twig = $twig;
	}

	public function __invoke(RequestEvent $event): void {
		$request = $event->getRequest();
		if ($this->isRequestToBeHandledByTheFront($request)) {
			$request->attributes->set('_controller', function(): Response {
				return new Response($this->twig->render('index.html'));
			});
		}
	}

	private function isRequestToBeHandledByTheFront(Request $request): bool {
		return !str_starts_with($request->getPathInfo(), "/api");
	}

}
